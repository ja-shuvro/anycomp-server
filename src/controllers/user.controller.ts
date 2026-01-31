import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { successResponse, paginatedResponse } from "../utils/response.helper";
import { parsePaginationParams, generatePaginationMeta } from "../utils/pagination.helper";

/**
 * User Controller
 * Handles HTTP requests for user management operations
 */
export class UserController {
    private service = new UserService();

    /**
     * Get all users with pagination (Admin only)
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit } = parsePaginationParams(req.query.page as string, req.query.limit as string);

            const { items, total } = await this.service.findAll(page, limit);

            const pagination = generatePaginationMeta(page, limit, total);

            return paginatedResponse(res, items, pagination, "Users retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get user by ID (Admin only)
     */
    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await this.service.findOne(id);
            return successResponse(res, user, "User retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete user (Admin only)
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
