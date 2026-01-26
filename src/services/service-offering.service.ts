import { AppDataSource } from "../data-source";
import { ServiceOfferingsMasterList } from "../entities/ServiceOfferingsMasterList.entity";
import { CreateServiceOfferingDto } from "../dto/service-offering/create-service-offering.dto";
import { UpdateServiceOfferingDto } from "../dto/service-offering/update-service-offering.dto";
import { NotFoundError, ConflictError } from "../errors/custom-errors";
import { calculateOffset } from "../utils/pagination.helper";
import logger from "../utils/logger";

/**
 * Service Offering Service
 * Business logic for service offering operations
 */
export class ServiceOfferingService {
    private serviceRepository = AppDataSource.getRepository(ServiceOfferingsMasterList);

    /**
     * Get all services with pagination
     */
    async findAll(page: number = 1, limit: number = 10): Promise<{ items: ServiceOfferingsMasterList[]; total: number }> {
        try {
            const skip = calculateOffset(page, limit);

            const [items, total] = await this.serviceRepository.findAndCount({
                order: { title: "ASC" },
                skip,
                take: limit,
            });

            return { items, total };
        } catch (error) {
            logger.error("Error finding all services:", error);
            throw error;
        }
    }

    /**
     * Get single service by ID
     */
    async findOne(id: string): Promise<ServiceOfferingsMasterList> {
        try {
            const service = await this.serviceRepository.findOne({
                where: { id },
            });

            if (!service) {
                throw new NotFoundError(
                    `Service offering with ID ${id} not found`,
                    "SERVICE_NOT_FOUND"
                );
            }

            return service;
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            logger.error(`Error finding service ${id}:`, error);
            throw error;
        }
    }

    /**
     * Create new service offering
     */
    async create(dto: CreateServiceOfferingDto): Promise<ServiceOfferingsMasterList> {
        try {
            // Check for duplicate serviceId
            const existing = await this.serviceRepository.findOne({
                where: { serviceId: dto.serviceId },
            });

            if (existing) {
                throw new ConflictError(
                    `Service offering with ID '${dto.serviceId}' already exists`,
                    "SERVICE_ID_EXISTS"
                );
            }

            const service = this.serviceRepository.create(dto);
            const saved = await this.serviceRepository.save(service);

            logger.info(`Created service offering: ${saved.title} (${saved.serviceId})`);
            return saved;
        } catch (error) {
            if (error instanceof ConflictError) throw error;
            logger.error("Error creating service offering:", error);
            throw error;
        }
    }

    /**
     * Update service offering
     */
    async update(id: string, dto: UpdateServiceOfferingDto): Promise<ServiceOfferingsMasterList> {
        try {
            const service = await this.findOne(id);

            Object.assign(service, dto);

            const updated = await this.serviceRepository.save(service);
            logger.info(`Updated service offering: ${updated.title}`);

            return updated;
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            logger.error(`Error updating service ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete service offering
     */
    async delete(id: string): Promise<void> {
        try {
            const result = await this.serviceRepository.delete(id);

            if (result.affected === 0) {
                throw new NotFoundError("Service offering not found", "SERVICE_NOT_FOUND");
            }

            logger.info(`Deleted service offering: ${id}`);
        } catch (error) {
            logger.error(`Error deleting service ${id}:`, error);
            throw error;
        }
    }
}
