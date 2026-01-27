import { AppDataSource } from "../data-source";
import { Media, MimeType, MediaType } from "../entities/Media.entity";
import { Specialist } from "../entities/Specialist.entity";
import { NotFoundError, ForbiddenError, UnauthorizedError } from "../errors/custom-errors";
import { UserRole } from "../entities/User.entity";
import logger from "../utils/logger";
import fs from "fs";
import path from "path";

export class MediaService {
    private mediaRepo = AppDataSource.getRepository(Media);
    private specialistRepo = AppDataSource.getRepository(Specialist);

    /**
     * Check if user is owner or admin
     */
    private async checkSpecialistOwnership(specialistId: string, user?: any) {
        if (!user) throw new UnauthorizedError("Authentication required");
        if (user.role === UserRole.ADMIN) return;

        const specialist = await this.specialistRepo.findOne({ where: { id: specialistId } });
        if (!specialist || specialist.userId !== user.id) {
            throw new ForbiddenError("You do not have permission to manage media for this specialist");
        }
    }

    /**
     * Map MIME type to MediaType enum
     */
    private getMediaType(mimeType: string): MediaType {
        if (mimeType.startsWith("image/")) return MediaType.IMAGE;
        if (mimeType.startsWith("video/")) return MediaType.VIDEO;
        if (mimeType === "application/pdf") return MediaType.DOCUMENT;
        return MediaType.IMAGE; // Default
    }

    /**
     * Map MIME type string to MimeType enum
     */
    private getMimeTypeEnum(mimeType: string): MimeType {
        const mimeMap: Record<string, MimeType> = {
            "image/jpeg": MimeType.IMAGE_JPEG,
            "image/jpg": MimeType.IMAGE_JPEG,
            "image/png": MimeType.IMAGE_PNG,
            "image/webp": MimeType.IMAGE_WEBP,
            "video/mp4": MimeType.VIDEO_MP4,
            "application/pdf": MimeType.APPLICATION_PDF,
        };
        return mimeMap[mimeType] || MimeType.IMAGE_JPEG;
    }

    /**
     * Upload media file
     */
    async upload(
        specialistId: string,
        file: Express.Multer.File,
        user?: any,
        displayOrder?: number
    ): Promise<Media> {
        await this.checkSpecialistOwnership(specialistId, user);
        // Verify specialist exists
        const specialist = await this.specialistRepo.findOne({ where: { id: specialistId } });
        if (!specialist) {
            // Clean up uploaded file
            fs.unlinkSync(file.path);
            throw new NotFoundError("Specialist not found");
        }

        // Determine display order if not provided
        if (displayOrder === undefined) {
            const maxOrder = await this.mediaRepo
                .createQueryBuilder("media")
                .where("media.specialists = :specialistId", { specialistId })
                .select("MAX(media.displayOrder)", "max")
                .getRawOne();
            displayOrder = (maxOrder?.max ?? -1) + 1;
        }

        // Create media record
        const media = this.mediaRepo.create({
            specialists: specialistId,
            fileName: file.filename,
            fileSize: file.size,
            displayOrder: displayOrder,
            mimeType: this.getMimeTypeEnum(file.mimetype),
            mediaType: this.getMediaType(file.mimetype),
            uploadedAt: new Date(),
            publicUrl: `/uploads/${file.filename}`, // Local URL
        });

        const savedMedia = await this.mediaRepo.save(media);
        logger.info(`Media uploaded: ${savedMedia.id} for specialist ${specialistId}`);

        return savedMedia;
    }

    /**
     * Delete media (soft delete + file removal)
     */
    async delete(id: string, user?: any): Promise<void> {
        const media = await this.mediaRepo.findOne({ where: { id } });
        if (!media) {
            throw new NotFoundError("Media not found");
        }

        await this.checkSpecialistOwnership(media.specialists, user);
        if (!media) {
            throw new NotFoundError("Media not found");
        }

        // Delete physical file
        const filePath = path.join("./uploads", media.fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            logger.info(`File deleted: ${filePath}`);
        }

        // Soft delete from DB
        await this.mediaRepo.softDelete(id);
        logger.info(`Media soft deleted: ${id}`);
    }

    /**
     * Get all media for a specialist
     */
    async getBySpecialist(specialistId: string): Promise<Media[]> {
        return await this.mediaRepo.find({
            where: { specialists: specialistId },
            order: { displayOrder: "ASC" },
        });
    }

    /**
     * Update display order
     */
    async reorder(id: string, newOrder: number, user?: any): Promise<Media> {
        const media = await this.mediaRepo.findOne({ where: { id } });
        if (!media) {
            throw new NotFoundError("Media not found");
        }

        await this.checkSpecialistOwnership(media.specialists, user);
        if (!media) {
            throw new NotFoundError("Media not found");
        }

        media.displayOrder = newOrder;
        return await this.mediaRepo.save(media);
    }
}
