/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Specialist } from "../entities/Specialist.entity";
import { Media } from "../entities/Media.entity";
import { UserRole } from "../entities/User.entity";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../errors/custom-errors";

/**
 * Middleware to check if the logged-in user owns the resource
 * @param resourceType The type of resource to check ('specialist' | 'media')
 * @param idSource Where to find the ID ('params' | 'body')
 * @param idKey The key name for the ID (default is 'id')
 */
export const ownershipMiddleware = (
    resourceType: "specialist" | "media",
    idSource: "params" | "body" = "params",
    idKey: string = "id"
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            const resourceId = idSource === "params" ? req.params[idKey] : req.body[idKey];

            if (!user) {
                throw new UnauthorizedError("Authentication required.");
            }

            if (!resourceId) {
                return next(); // Let validation middleware handle missing IDs if applicable
            }

            // Admins bypass ownership checks
            if (user.role === UserRole.ADMIN) {
                return next();
            }

            if (resourceType === "specialist") {
                const specialistRepo = AppDataSource.getRepository(Specialist);
                const specialist = await specialistRepo.findOne({
                    where: { id: resourceId }
                });

                if (!specialist) {
                    throw new NotFoundError("Specialist not found.");
                }

                if (specialist.userId !== user.id) {
                    throw new ForbiddenError("You do not have permission to access this resource.");
                }
            } else if (resourceType === "media") {
                const mediaRepo = AppDataSource.getRepository(Media);
                const media = await mediaRepo.findOne({
                    where: { id: resourceId },
                    relations: ["specialist"]
                });

                if (!media) {
                    throw new NotFoundError("Media record not found.");
                }

                if (media.specialist.userId !== user.id) {
                    throw new ForbiddenError("You do not have permission to access this resource.");
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
