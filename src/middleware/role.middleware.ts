import { Request, Response, NextFunction } from "express";
import { UserRole } from "../entities/User.entity";
import { ForbiddenError, UnauthorizedError } from "../errors/custom-errors";

/**
 * Middleware to restrict access based on user roles
 */
export const roleMiddleware = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new UnauthorizedError("Authentication required.");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ForbiddenError("You do not have permission to perform this action.");
        }

        next();
    };
};
