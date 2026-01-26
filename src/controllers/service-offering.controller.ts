import { Request, Response, NextFunction } from "express";
import { ServiceOfferingService } from "../services/service-offering.service";
import { successResponse, paginatedResponse } from "../utils/response.helper";
import { parsePaginationParams, generatePaginationMeta } from "../utils/pagination.helper";
import { CreateServiceOfferingDto } from "../dto/service-offering/create-service-offering.dto";
import { UpdateServiceOfferingDto } from "../dto/service-offering/update-service-offering.dto";

/**
 * Service Offering Controller
 * Handles HTTP requests for service offering operations
 * 
 * @see ../swagger/paths/service-offering.docs.ts for API documentation
 */
export class ServiceOfferingController {
    private service = new ServiceOfferingService();

    /**
     * Get all service offerings with pagination
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit } = parsePaginationParams(req.query.page as string, req.query.limit as string);

            const { items, total } = await this.service.findAll(page, limit);

            const pagination = generatePaginationMeta(page, limit, total);

            return paginatedResponse(res, items, pagination, "Service offerings retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get service offering by ID
     */
    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const service = await this.service.findOne(id);
            return successResponse(res, service, "Service offering retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create new service offering
     */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: CreateServiceOfferingDto = req.body;
            const service = await this.service.create(dto);
            return successResponse(res, service, "Service offering created successfully", 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update service offering
     */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const dto: UpdateServiceOfferingDto = req.body;
            const service = await this.service.update(id, dto);
            return successResponse(res, service, "Service offering updated successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete service offering
     */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.service.delete(id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
