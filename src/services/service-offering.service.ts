import { AppDataSource } from "../data-source";
import { ServiceOfferingsMasterList } from "../entities/ServiceOfferingsMasterList.entity";
import { ServiceOffering } from "../entities/ServiceOffering.entity";
import { Specialist } from "../entities/Specialist.entity";
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
                relations: [
                    "serviceOfferings",
                    "serviceOfferings.specialist"
                ],
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
                relations: [
                    "serviceOfferings",
                    "serviceOfferings.specialist"
                ],
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
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const specialistRepository = queryRunner.manager.getRepository(Specialist);
            const serviceRepository = queryRunner.manager.getRepository(ServiceOfferingsMasterList);
            const serviceOfferingRepository = queryRunner.manager.getRepository(ServiceOffering);

            // Validate that specialist exists
            const specialist = await specialistRepository.findOne({
                where: { id: dto.specialistId },
            });

            if (!specialist) {
                throw new NotFoundError(
                    `Specialist with ID ${dto.specialistId} not found`,
                    "SPECIALIST_NOT_FOUND"
                );
            }

            // Create ServiceOfferingsMasterList
            const { specialistId, ...masterListData } = dto;
            const serviceMasterList = serviceRepository.create(masterListData);
            const savedMasterList = await queryRunner.manager.save(serviceMasterList);

            // Create ServiceOffering junction entry
            const serviceOffering = serviceOfferingRepository.create({
                serviceOfferingsMasterListId: savedMasterList.id,
                specialists: specialistId,
            });
            await queryRunner.manager.save(serviceOffering);

            // Commit transaction
            await queryRunner.commitTransaction();

            logger.info(
                `Created service offering: ${savedMasterList.title} and linked to specialist ${specialistId}`
            );
            return savedMasterList;
        } catch (error) {
            // Rollback transaction on error
            await queryRunner.rollbackTransaction();
            if (error instanceof NotFoundError) throw error;
            logger.error("Error creating service offering:", error);
            throw error;
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }

    /**
     * Update service offering
     */
    async update(id: string, dto: UpdateServiceOfferingDto): Promise<ServiceOfferingsMasterList> {
        // If specialistId is provided, we need to use a transaction to update the junction table
        if (dto.specialistId) {
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const specialistRepository = queryRunner.manager.getRepository(Specialist);
                const serviceRepository = queryRunner.manager.getRepository(ServiceOfferingsMasterList);
                const serviceOfferingRepository = queryRunner.manager.getRepository(ServiceOffering);

                // Validate that specialist exists
                const specialist = await specialistRepository.findOne({
                    where: { id: dto.specialistId },
                });

                if (!specialist) {
                    throw new NotFoundError(
                        `Specialist with ID ${dto.specialistId} not found`,
                        "SPECIALIST_NOT_FOUND"
                    );
                }

                // Find the service offering master list
                const service = await serviceRepository.findOne({
                    where: { id },
                });

                if (!service) {
                    throw new NotFoundError(
                        `Service offering with ID ${id} not found`,
                        "SERVICE_NOT_FOUND"
                    );
                }

                // Update master list fields (excluding specialistId)
                const { specialistId, ...masterListData } = dto;
                Object.assign(service, masterListData);
                const updated = await queryRunner.manager.save(service);

                // Delete old junction entries for this service offering master list
                await serviceOfferingRepository.delete({
                    serviceOfferingsMasterListId: id,
                });

                // Create new junction entry with updated specialist
                const serviceOffering = serviceOfferingRepository.create({
                    serviceOfferingsMasterListId: id,
                    specialists: specialistId,
                });
                await queryRunner.manager.save(serviceOffering);

                // Commit transaction
                await queryRunner.commitTransaction();

                logger.info(`Updated service offering: ${updated.title} and linked to specialist ${specialistId}`);
                return updated;
            } catch (error) {
                // Rollback transaction on error
                await queryRunner.rollbackTransaction();
                if (error instanceof NotFoundError) throw error;
                logger.error(`Error updating service ${id}:`, error);
                throw error;
            } finally {
                // Release query runner
                await queryRunner.release();
            }
        } else {
            // No specialist change, just update master list fields
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
