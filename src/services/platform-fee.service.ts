import { AppDataSource } from "../data-source";
import { Brackets } from "typeorm";
import { PlatformFee } from "../entities/PlatformFee.entity";
import { CreatePlatformFeeDto } from "../dto/platform-fee/create-platform-fee.dto";
import { UpdatePlatformFeeDto } from "../dto/platform-fee/update-platform-fee.dto";
import { NotFoundError, ConflictError, BadRequestError } from "../errors/custom-errors";
import logger from "../utils/logger";

/**
 * Platform Fee Service
 * Business logic for platform fee operations
 */
export class PlatformFeeService {
    private platformFeeRepository = AppDataSource.getRepository(PlatformFee);

    /**
     * Get all platform fees with pagination
     */
    async findAll(page: number = 1, limit: number = 10): Promise<{ items: PlatformFee[]; total: number }> {
        try {
            const skip = (page - 1) * limit;

            const [items, total] = await this.platformFeeRepository.findAndCount({
                order: { minValue: "ASC" },
                skip,
                take: limit,
            });

            return { items, total };
        } catch (error) {
            logger.error("Error finding all platform fees:", error);
            throw error;
        }
    }

    /**
     * Get single platform fee by ID
     */
    async findOne(id: string): Promise<PlatformFee> {
        try {
            const platformFee = await this.platformFeeRepository.findOne({
                where: { id },
            });

            if (!platformFee) {
                throw new NotFoundError(
                    `Platform fee with ID ${id} not found`,
                    "PLATFORM_FEE_NOT_FOUND"
                );
            }

            return platformFee;
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            logger.error("Error finding platform fee:", error);
            throw error;
        }
    }

    /**
     * Find tier that matches a given price
     */
    async findTierByPrice(price: number): Promise<PlatformFee | null> {
        try {
            const tier = await this.platformFeeRepository
                .createQueryBuilder("pf")
                .where("pf.minValue <= :price", { price })
                .andWhere("pf.maxValue >= :price", { price })
                .getOne();

            return tier;
        } catch (error) {
            logger.error("Error finding tier by price:", error);
            throw error;
        }
    }

    /**
     * Create new platform fee
     */
    async create(dto: CreatePlatformFeeDto): Promise<PlatformFee> {
        try {
            // Validate minValue < maxValue
            if (dto.minValue >= dto.maxValue) {
                throw new BadRequestError(
                    "minValue must be less than maxValue",
                    "INVALID_RANGE"
                );
            }

            // Check if tier name already exists
            const existingTier = await this.platformFeeRepository.findOne({
                where: { tierName: dto.tierName },
            });

            if (existingTier) {
                throw new ConflictError(
                    `Platform fee tier '${dto.tierName}' already exists`,
                    "TIER_NAME_EXISTS"
                );
            }

            // Check for overlapping ranges
            const overlapping = await this.platformFeeRepository
                .createQueryBuilder("pf")
                .where(
                    "(pf.min_value <= :minValue AND pf.max_value >= :minValue) OR " +
                    "(pf.min_value <= :maxValue AND pf.max_value >= :maxValue) OR " +
                    "(pf.min_value >= :minValue AND pf.max_value <= :maxValue)",
                    {
                        minValue: dto.minValue,
                        maxValue: dto.maxValue,
                    }
                )
                .getOne();

            if (overlapping) {
                throw new ConflictError(
                    `Price range ${dto.minValue}-${dto.maxValue} overlaps with existing tier '${overlapping.tierName}'`,
                    "RANGE_OVERLAP"
                );
            }

            // Create and save
            const platformFee = this.platformFeeRepository.create(dto);
            const saved = await this.platformFeeRepository.save(platformFee);

            logger.info(`Created platform fee tier: ${saved.tierName}`);
            return saved;
        } catch (error) {
            if (
                error instanceof BadRequestError ||
                error instanceof ConflictError
            ) {
                throw error;
            }
            logger.error("Error creating platform fee:", error);
            throw error;
        }
    }

    /**
     * Update existing platform fee
     */
    async update(id: string, dto: UpdatePlatformFeeDto): Promise<PlatformFee> {
        try {
            // Find existing
            const platformFee = await this.findOne(id);

            // Validate range if both values provided
            const newMinValue = dto.minValue ?? platformFee.minValue;
            const newMaxValue = dto.maxValue ?? platformFee.maxValue;

            if (newMinValue >= newMaxValue) {
                throw new BadRequestError(
                    "minValue must be less than maxValue",
                    "INVALID_RANGE"
                );
            }

            // Check for overlapping ranges (exclude current tier)
            if (dto.minValue !== undefined || dto.maxValue !== undefined) {
                const overlapping = await this.platformFeeRepository
                    .createQueryBuilder("pf")
                    .where("pf.id != :id", { id })
                    .andWhere(
                        new Brackets((qb) => {
                            qb.where("pf.min_value <= :minValue AND pf.max_value >= :minValue", { minValue: newMinValue })
                                .orWhere("pf.min_value <= :maxValue AND pf.max_value >= :maxValue", { maxValue: newMaxValue })
                                .orWhere("pf.min_value >= :minValue AND pf.max_value <= :maxValue", { minValue: newMinValue, maxValue: newMaxValue });
                        })
                    )
                    .getOne();

                if (overlapping) {
                    throw new ConflictError(
                        `Price range ${newMinValue}-${newMaxValue} overlaps with existing tier '${overlapping.tierName}'`,
                        "RANGE_OVERLAP"
                    );
                }
            }

            // Update fields
            if (dto.tierName) platformFee.tierName = dto.tierName;
            if (dto.minValue !== undefined) platformFee.minValue = dto.minValue;
            if (dto.maxValue !== undefined) platformFee.maxValue = dto.maxValue;
            if (dto.platformFeePercentage !== undefined) {
                platformFee.platformFeePercentage = dto.platformFeePercentage;
            }

            const updatedPlatformFee = await this.platformFeeRepository.save(platformFee);
            logger.info(`Platform fee updated: ${updatedPlatformFee.id}`);

            return updatedPlatformFee;
        } catch (error) {
            logger.error(`Error updating platform fee ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete platform fee by ID
     */
    async delete(id: string): Promise<void> {
        try {
            const result = await this.platformFeeRepository.delete(id);

            if (result.affected === 0) {
                throw new NotFoundError("Platform fee not found", "PLATFORM_FEE_NOT_FOUND");
            }

            logger.info(`Platform fee deleted: ${id}`);
        } catch (error) {
            logger.error(`Error deleting platform fee ${id}:`, error);
            throw error;
        }
    }

    /**
     * Calculate platform fee for a given price
     */
    async calculateFee(basePrice: number): Promise<{ fee: number; tierName: string }> {
        const tier = await this.findTierByPrice(basePrice);

        if (!tier) {
            // Default to highest tier if price exceeds all ranges
            const { items } = await this.findAll(1, 100); // Get all tiers
            const highestTier = items[items.length - 1];
            const fee = (basePrice * highestTier.platformFeePercentage) / 100;

            return {
                fee: Math.round(fee * 100) / 100,
                tierName: highestTier.tierName,
            };
        }

        const fee = (basePrice * tier.platformFeePercentage) / 100;

        return {
            fee: Math.round(fee * 100) / 100,
            tierName: tier.tierName,
        };
    }
}
