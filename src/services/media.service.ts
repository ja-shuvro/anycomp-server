import { AppDataSource } from "../data-source";
import { Media, MimeType, MediaType } from "../entities/Media.entity";
import { Specialist } from "../entities/Specialist.entity";
import { NotFoundError, ForbiddenError, UnauthorizedError } from "../errors/custom-errors";
import { UserRole } from "../entities/User.entity";
import logger from "../utils/logger";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.config";
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
        specialistId: string | undefined,
        file: Express.Multer.File,
        user?: any,
        displayOrder?: number
    ): Promise<Media> {
        // Only check ownership if specialistId is provided
        if (specialistId) {
            await this.checkSpecialistOwnership(specialistId, user);

            // Verify specialist exists
            const specialist = await this.specialistRepo.findOne({ where: { id: specialistId } });
            if (!specialist) {
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
        } else {
            // If no specialist ID, default display order to 0
            displayOrder = displayOrder ?? 0;
        }

        // Upload to Cloudinary
        let cloudinaryResult;
        try {
            cloudinaryResult = await uploadToCloudinary(file.buffer, "anycomp/media");
        } catch (error) {
            logger.error("Failed to upload to Cloudinary:", error);
            throw new Error("Failed to upload file to cloud storage");
        }

        // Create media record with Cloudinary data
        const media = this.mediaRepo.create({
            specialists: specialistId || null,
            fileName: cloudinaryResult.public_id, // Store Cloudinary public_id for deletion
            fileSize: file.size,
            displayOrder: displayOrder,
            mimeType: this.getMimeTypeEnum(file.mimetype),
            mediaType: this.getMediaType(file.mimetype),
            uploadedAt: new Date(),
            publicUrl: cloudinaryResult.secure_url, // Cloudinary URL
        });

        const savedMedia = await this.mediaRepo.save(media);
        logger.info(`Media uploaded to Cloudinary: ${savedMedia.id}${specialistId ? ` for specialist ${specialistId}` : ''}`);

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

        // Only check ownership if media has a specialist assigned
        if (media.specialists) {
            await this.checkSpecialistOwnership(media.specialists, user);
        }

        // Delete from Cloudinary (fileName contains the public_id)
        try {
            await deleteFromCloudinary(media.fileName);
            logger.info(`File deleted from Cloudinary: ${media.fileName}`);
        } catch (error) {
            logger.error(`Failed to delete from Cloudinary: ${media.fileName}`, error);
            // Continue with DB deletion even if Cloudinary deletion fails
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

        // Only check ownership if media has a specialist assigned
        if (media.specialists) {
            await this.checkSpecialistOwnership(media.specialists, user);
        }

        media.displayOrder = newOrder;
        return await this.mediaRepo.save(media);
    }

    /**
     * Update media (specialist assignment and/or display order)
     */
    async update(
        id: string,
        specialistId?: string,
        displayOrder?: number,
        user?: any
    ): Promise<Media> {
        const media = await this.mediaRepo.findOne({ where: { id } });
        if (!media) {
            throw new NotFoundError("Media not found");
        }

        // Check ownership for existing specialist
        if (media.specialists) {
            await this.checkSpecialistOwnership(media.specialists, user);
        }

        // Check ownership for new specialist if changing
        if (specialistId && specialistId !== media.specialists) {
            await this.checkSpecialistOwnership(specialistId, user);

            // Verify new specialist exists
            const specialist = await this.specialistRepo.findOne({ where: { id: specialistId } });
            if (!specialist) {
                throw new NotFoundError("Specialist not found");
            }

            media.specialists = specialistId;
        }

        if (displayOrder !== undefined) {
            media.displayOrder = displayOrder;
        }

        const updatedMedia = await this.mediaRepo.save(media);
        logger.info(`Media updated: ${id}`);

        return updatedMedia;
    }
}
