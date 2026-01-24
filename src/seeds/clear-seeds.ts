import { AppDataSource } from "../data-source";
import logger from "../utils/logger";

/**
 * Clear all seed data from database
 */
async function clearAllSeeds() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        logger.info("🗑️  Clearing all seed data...");

        // Use query runner for cascading truncate
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            // Truncate tables in reverse order of dependencies with CASCADE
            await queryRunner.query(`TRUNCATE TABLE media RESTART IDENTITY CASCADE;`);
            logger.info("✅ Cleared Media table");

            await queryRunner.query(`TRUNCATE TABLE service_offerings RESTART IDENTITY CASCADE;`);
            logger.info("✅ Cleared ServiceOffering table");

            await queryRunner.query(`TRUNCATE TABLE specialists RESTART IDENTITY CASCADE;`);
            logger.info("✅ Cleared Specialist table");

            await queryRunner.query(`TRUNCATE TABLE service_offerings_master_list RESTART IDENTITY CASCADE;`);
            logger.info("✅ Cleared ServiceOfferingsMasterList table");

            await queryRunner.query(`TRUNCATE TABLE platform_fee RESTART IDENTITY CASCADE;`);
            logger.info("✅ Cleared PlatformFee table");
        } finally {
            await queryRunner.release();
        }

        logger.info("✅ All seed data cleared successfully!");
        process.exit(0);
    } catch (error) {
        logger.error("❌ Error clearing seed data:", error);
        process.exit(1);
    }
}

clearAllSeeds();
