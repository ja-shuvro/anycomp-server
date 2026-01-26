import { AppDataSource } from "../data-source";
import logger from "../utils/logger";

/**
 * Verify indexes on service_offerings_master_list
 */
async function verifyIndexes() {
    try {
        await AppDataSource.initialize();
        const queryRunner = AppDataSource.createQueryRunner();

        logger.info("\n🔍 Checking indexes for 'service_offerings_master_list'...");

        const indexes = await queryRunner.query(`
            SELECT 
                tablename, 
                indexname, 
                indexdef
            FROM pg_indexes 
            WHERE schemaname = 'public' 
            AND tablename = 'service_offerings_master_list'
        `);

        if (indexes.length === 0) {
            logger.warn("⚠️  No indexes found for this table!");
        } else {
            logger.info(`✅ Found ${indexes.length} indexes:`);
            indexes.forEach((idx: any) => {
                logger.info(`\n- Name: ${idx.indexname}`);
                logger.info(`  Definition: ${idx.indexdef}`);
            });
        }

        await AppDataSource.destroy();
        process.exit(0);
    } catch (error) {
        logger.error("❌ verification failed:", error);
        process.exit(1);
    }
}

verifyIndexes();
