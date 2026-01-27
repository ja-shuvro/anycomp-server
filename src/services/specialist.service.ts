import { AppDataSource } from "../data-source";
import { Specialist, VerificationStatus } from "../entities/Specialist.entity";
import { ServiceOffering } from "../entities/ServiceOffering.entity";
import { ServiceOfferingsMasterList } from "../entities/ServiceOfferingsMasterList.entity";
import { CreateSpecialistDto } from "../dto/specialist/create-specialist.dto";
import { UpdateSpecialistDto } from "../dto/specialist/update-specialist.dto";
import { FilterSpecialistDto } from "../dto/specialist/filter-specialist.dto";
import { PlatformFeeService } from "./platform-fee.service";
import { NotFoundError, BadRequestError, ForbiddenError, UnauthorizedError } from "../errors/custom-errors";
import { UserRole } from "../entities/User.entity";
import { calculateOffset } from "../utils/pagination.helper";
import logger from "../utils/logger";
import { In } from "typeorm";

export class SpecialistService {
    private specialistRepo = AppDataSource.getRepository(Specialist);
    private serviceOfferingRepo = AppDataSource.getRepository(ServiceOffering);
    private platformFeeService = new PlatformFeeService();

    /**
     * Generate URL-friendly slug from title
     */
    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    /**
     * Ensure slug is unique
     */
    private async ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
        let uniqueSlug = slug;
        let counter = 1;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const query = this.specialistRepo.createQueryBuilder("s")
                .where("s.slug = :slug", { slug: uniqueSlug });

            if (excludeId) {
                query.andWhere("s.id != :id", { id: excludeId });
            }

            const existing = await query.getOne();

            if (!existing) break;

            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        return uniqueSlug;
    }

    /**
     * Create new specialist
     */
    async create(dto: CreateSpecialistDto, user?: any): Promise<Specialist> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Handle Slug
            const baseSlug = dto.slug || this.generateSlug(dto.title);
            const slug = await this.ensureUniqueSlug(baseSlug);

            // 2. Calculate Prices
            const feeData = await this.platformFeeService.calculateFee(dto.basePrice);
            const platformFee = feeData.fee;
            const finalPrice = dto.basePrice + platformFee;

            // 3. Create Specialist
            const specialist = this.specialistRepo.create({
                ...dto,
                slug,
                platformFee,
                finalPrice,
                isDraft: true,
                verificationStatus: VerificationStatus.PENDING,
                isVerified: false,
                userId: user?.id
            });

            const savedSpecialist = await queryRunner.manager.save(specialist);

            // 4. Handle Service Assignments (if any)
            if (dto.serviceIds && dto.serviceIds.length > 0) {
                await this.assignServicesTx(queryRunner, savedSpecialist.id, dto.serviceIds);
            }

            await queryRunner.commitTransaction();

            // Return full object with relations
            return this.findOne(savedSpecialist.id);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            logger.error("Error creating specialist:", error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Helper to assign services within a transaction
     */
    private async assignServicesTx(queryRunner: any, specialistId: string, serviceIds: string[]) {
        // Verify all service IDs exist
        const masterServices = await queryRunner.manager
            .getRepository(ServiceOfferingsMasterList)
            .findBy({ id: In(serviceIds) });

        if (masterServices.length !== serviceIds.length) {
            throw new BadRequestError("One or more service IDs are invalid");
        }

        // Create junction records
        const serviceOfferings = serviceIds.map(serviceId => {
            return queryRunner.manager.getRepository(ServiceOffering).create({
                specialists: specialistId,
                serviceOfferingsMasterListId: serviceId
            });
        });

        await queryRunner.manager.save(serviceOfferings);
    }

    /**
     * Find one specialist with full details
     */
    async findOne(id: string): Promise<Specialist> {
        const specialist = await this.specialistRepo.findOne({
            where: { id },
            relations: ["serviceOfferings", "serviceOfferings.serviceOfferingsMasterList", "media"]
        });

        if (!specialist) {
            throw new NotFoundError("Specialist not found");
        }

        return specialist;
    }

    /**
     * Check if user is owner or admin
     */
    private checkOwnership(specialist: Specialist, user?: any) {
        if (!user) {
            throw new UnauthorizedError("Authentication required");
        }
        if (user.role !== UserRole.ADMIN && specialist.userId !== user.id) {
            throw new ForbiddenError("You do not have permission to modify this specialist");
        }
    }

    /**
     * Find all with filtering and pagination
     */
    async findAll(
        filters: FilterSpecialistDto,
        page: number = 1,
        limit: number = 10
    ): Promise<{ items: Specialist[]; total: number }> {
        const query = this.specialistRepo.createQueryBuilder("s")
            .leftJoinAndSelect("s.serviceOfferings", "so")
            .leftJoinAndSelect("so.serviceOfferingsMasterList", "soml")
            .leftJoinAndSelect("s.media", "m");

        // Apply filters
        if (filters.search) {
            query.andWhere(
                "(s.title ILIKE :search OR s.description ILIKE :search OR soml.title ILIKE :search)",
                { search: `%${filters.search}%` }
            );
        }

        if (filters.status) {
            query.andWhere("s.verificationStatus = :status", { status: filters.status });
        }

        if (filters.isDraft !== undefined) {
            query.andWhere("s.isDraft = :isDraft", { isDraft: filters.isDraft });
        }

        if (filters.minPrice) {
            query.andWhere("s.basePrice >= :minPrice", { minPrice: filters.minPrice });
        }

        if (filters.maxPrice) {
            query.andWhere("s.basePrice <= :maxPrice", { maxPrice: filters.maxPrice });
        }

        if (filters.minRating) {
            query.andWhere("s.averageRating >= :minRating", { minRating: filters.minRating });
        }

        // Sorting
        const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';

        switch (filters.sortBy) {
            case 'price':
                query.orderBy("s.finalPrice", sortOrder);
                break;
            case 'rating':
                query.orderBy("s.averageRating", sortOrder);
                break;
            case 'alphabetical':
                query.orderBy("s.title", sortOrder);
                break;
            case 'newest':
            default:
                query.orderBy("s.createdAt", "DESC");
                break;
        }

        // Pagination
        const skip = calculateOffset(page, limit);
        query.skip(skip).take(limit);

        const [items, total] = await query.getManyAndCount();

        return { items, total };
    }

    /**
     * Update specialist
     */
    async update(id: string, dto: UpdateSpecialistDto, user?: any): Promise<Specialist> {
        const specialist = await this.findOne(id);

        this.checkOwnership(specialist, user);

        // Check slug uniqueness if changed
        if (dto.slug && dto.slug !== specialist.slug) {
            dto.slug = await this.ensureUniqueSlug(dto.slug, id);
        }

        // Recalculate price if basePrice changed
        if (dto.basePrice !== undefined && dto.basePrice !== specialist.basePrice) {
            const feeData = await this.platformFeeService.calculateFee(dto.basePrice);
            specialist.platformFee = feeData.fee;
            specialist.finalPrice = dto.basePrice + feeData.fee;
        }

        Object.assign(specialist, dto);

        return await this.specialistRepo.save(specialist);
    }

    /**
     * Publish specialist (transition from draft to published)
     */
    async publish(id: string, user?: any): Promise<Specialist> {
        const specialist = await this.findOne(id);

        this.checkOwnership(specialist, user);

        // Validation: Check if already published
        if (!specialist.isDraft) {
            throw new BadRequestError("Specialist is already published");
        }

        // Validation: Check if has required fields
        if (!specialist.title || !specialist.description || !specialist.basePrice || !specialist.durationDays) {
            throw new BadRequestError("Missing required fields for publishing");
        }

        // Validation: Check if has at least one service
        if (!specialist.serviceOfferings || specialist.serviceOfferings.length === 0) {
            throw new BadRequestError("Specialist must have at least one service to be published");
        }

        // Validation: Check verification status
        if (specialist.verificationStatus === VerificationStatus.REJECTED) {
            throw new BadRequestError("Cannot publish a rejected specialist");
        }

        // Update to published
        specialist.isDraft = false;

        return await this.specialistRepo.save(specialist);
    }

    /**
     * Delete specialist (soft delete)
     */
    async delete(id: string, user?: any): Promise<void> {
        const specialist = await this.findOne(id);
        this.checkOwnership(specialist, user);

        const result = await this.specialistRepo.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundError("Specialist not found");
        }
    }
}
