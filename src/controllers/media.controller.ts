import { Request, Response, NextFunction } from "express";
import { MediaService } from "../services/media.service";
import { successResponse } from "../utils/response.helper";
import { UploadMediaDto } from "../dto/media/upload-media.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

/**
 * Media Controller
 * Handles file uploads and media management
 */
export class MediaController {
    private service = new MediaService();

    /**
     * Upload media file
     */
    async upload(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: "BAD_REQUEST",
                        message: "No file uploaded",
                    },
                });
            }

            // Validate DTO
            const dto = plainToInstance(UploadMediaDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Validation failed",
                        details: errors,
                    },
                });
            }

            const media = await this.service.upload(
                dto.specialistId,
                req.file,
                dto.displayOrder
            );

            return successResponse(res, media, "Media uploaded successfully", 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete media
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

    /**
     * Get media for a specialist
     */
    async getBySpecialist(req: Request, res: Response, next: NextFunction) {
        try {
            const { specialistId } = req.params;
            const media = await this.service.getBySpecialist(specialistId);
            return successResponse(res, media, "Media retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update display order
     */
    async reorder(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { displayOrder } = req.body;
            const media = await this.service.reorder(id, displayOrder);
            return successResponse(res, media, "Display order updated successfully");
        } catch (error) {
            next(error);
        }
    }
}
