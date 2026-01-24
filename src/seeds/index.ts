import { seedPlatformFees } from "./seed-platform-fees";
import { seedServiceOfferings } from "./seed-service-offerings";
import { seedSpecialists } from "./seed-specialists";
import { seedServiceOfferingAssignments } from "./seed-service-offering-assignments";
import { seedMedia } from "./seed-media";
import logger from "../utils/logger";

/**
 * Run all seeds
 */
async function runAllSeeds() {
    try {
        logger.info("🌱 Starting database seeding...");

        // Seed base data first
        await seedPlatformFees();
        await seedServiceOfferings();

        // Seed specialists
        await seedSpecialists();

        // Seed relationships (requires specialists and service offerings to exist)
        await seedServiceOfferingAssignments();

        // Seed media (requires specialists to exist)
        await seedMedia();

        logger.info("✅ All seeds completed successfully!");
        process.exit(0);
    } catch (error) {
        logger.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

runAllSeeds();
