import { Request, Response, NextFunction } from "express";
import { SpecialistService } from "../services/specialist.service";
import { successResponse, paginatedResponse } from "../utils/response.helper";
import { parsePaginationParams, generatePaginationMeta } from "../utils/pagination.helper";
import { CreateSpecialistDto } from "../dto/specialist/create-specialist.dto";
import { UpdateSpecialistDto } from "../dto/specialist/update-specialist.dto";

/**
 * Specialist Controller
 * Handles HTTP requests for specialist operations
 * 
 * @see ../swagger/paths/specialist.docs.ts for API documentation
 */
export class SpecialistController {
    private service = new SpecialistService();

    /**
     * Get all specialists with filtering and pagination
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit } = parsePaginationParams(req.query.page as string, req.query.limit as string);

            // Map query params directly to avoid transformation issues
            const filters: any = {
                search: req.query.search,
                status: req.query.status,
                isDraft: req.query.isDraft === 'true' ? true : req.query.isDraft === 'false' ? false : undefined,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
                minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder
            };

            const { items, total } = await this.service.findAll(filters, page, limit);

            const pagination = generatePaginationMeta(page, limit, total);

            return paginatedResponse(res, items, pagination, "Specialists retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get specialist by ID
     */
    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const specialist = await this.service.findOne(id);
            return successResponse(res, specialist, "Specialist retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create new specialist
     */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: CreateSpecialistDto = req.body;
            const specialist = await this.service.create(dto, req.user);
            return successResponse(res, specialist, "Specialist created successfully", 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update specialist
     */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const dto: UpdateSpecialistDto = req.body;
            const specialist = await this.service.update(id, dto, req.user);
            return successResponse(res, specialist, "Specialist updated successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Publish specialist (draft to published)
     */
    async publish(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const specialist = await this.service.publish(id, req.user);
            return successResponse(res, specialist, "Specialist published successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete specialist
     */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.service.delete(id, req.user);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
