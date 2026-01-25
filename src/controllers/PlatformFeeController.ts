import { Request, Response, NextFunction } from "express";
import { PlatformFeeService } from "../services/platform-fee.service";
import { successResponse, paginatedResponse } from "../utils/response.helper";
import { parsePaginationParams, generatePaginationMeta } from "../utils/pagination.helper";
import { CreatePlatformFeeDto } from "../dto/platform-fee/create-platform-fee.dto";
import { UpdatePlatformFeeDto } from "../dto/platform-fee/update-platform-fee.dto";

/**
 * Platform Fee Controller
 * Handles HTTP requests for platform fee operations
 * 
 * @see ../swagger/paths/platform-fee.docs.ts for API documentation
 */
export class PlatformFeeController {
    private platformFeeService = new PlatformFeeService();

    /**
     * Get all platform fee tiers with pagination
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit } = parsePaginationParams(req.query.page as string, req.query.limit as string);

            const { items, total } = await this.platformFeeService.findAll(page, limit);

            const pagination = generatePaginationMeta(page, limit, total);

            return paginatedResponse(res, items, pagination, "Platform fees retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get platform fee by ID
     */
    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const platformFee = await this.platformFeeService.findOne(id);
            return successResponse(res, platformFee, "Platform fee retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create new platform fee tier
     */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: CreatePlatformFeeDto = req.body;
            const platformFee = await this.platformFeeService.create(dto);
            return successResponse(res, platformFee, "Platform fee created successfully", 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update platform fee tier
     */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const dto: UpdatePlatformFeeDto = req.body;
            const platformFee = await this.platformFeeService.update(id, dto);
            return successResponse(res, platformFee, "Platform fee updated successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete platform fee tier
     */
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.platformFeeService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
