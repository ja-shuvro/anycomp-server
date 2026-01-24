import { AppDataSource } from "../data-source";
import { Media, MimeType, MediaType } from "../entities/Media.entity";
import { Specialist } from "../entities/Specialist.entity";
import logger from "../utils/logger";

/**
 * Seed media for specialists
 */
export async function seedMedia() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const mediaRepository = AppDataSource.getRepository(Media);
        const specialistRepository = AppDataSource.getRepository(Specialist);

        // Check if data already exists
        const count = await mediaRepository.count();
        if (count > 0) {
            logger.info("Media already seeded, skipping...");
            return;
        }

        // Get all specialists
        const specialists = await specialistRepository.find();

        if (specialists.length === 0) {
            logger.warn("Cannot seed media: specialists not found");
            return;
        }

        let mediaCount = 0;

        // Add sample media for each specialist
        for (const specialist of specialists) {
            // Add 2-3 images per specialist
            const imagesToAdd = Math.floor(Math.random() * 2) + 2; // 2 or 3 images

            for (let i = 0; i < imagesToAdd; i++) {
                const media = mediaRepository.create({
                    specialists: specialist.id,
                    fileName: `${specialist.slug}-image-${i + 1}.jpg`,
                    fileSize: Math.floor(Math.random() * 500000) + 100000, // 100KB - 600KB
                    displayOrder: i,
                    mimeType: MimeType.IMAGE_JPEG,
                    mediaType: MediaType.IMAGE,
                    uploadedAt: new Date(),
                });

                await mediaRepository.save(media);
                mediaCount++;
            }

            // Add 1 PDF document for some specialists (50% chance)
            if (Math.random() > 0.5) {
                const document = mediaRepository.create({
                    specialists: specialist.id,
                    fileName: `${specialist.slug}-brochure.pdf`,
                    fileSize: Math.floor(Math.random() * 1000000) + 500000, // 500KB - 1.5MB
                    displayOrder: imagesToAdd,
                    mimeType: MimeType.APPLICATION_PDF,
                    mediaType: MediaType.DOCUMENT,
                    uploadedAt: new Date(),
                });

                await mediaRepository.save(document);
                mediaCount++;
            }
        }

        logger.info(`✅ Successfully seeded ${mediaCount} media files for ${specialists.length} specialists`);
    } catch (error) {
        logger.error("❌ Error seeding media:", error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    seedMedia()
        .then(() => {
            logger.info("Seed completed");
            process.exit(0);
        })
        .catch((error) => {
            logger.error("Seed failed:", error);
            process.exit(1);
        });
}
