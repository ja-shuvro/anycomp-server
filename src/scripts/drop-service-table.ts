import { DataSource } from "typeorm";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

/**
 * Drop service table without triggering sync
 */
async function forceDropParams() {
    // Create a datasource strictly for dropping, NO entities, NO sync
    const DropDataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASS || "postgres",
        database: process.env.DB_NAME || "anycomp_db",
        synchronize: false, // Critical: Disable sync
        logging: false,
    });

    try {
        await DropDataSource.initialize();
        const queryRunner = DropDataSource.createQueryRunner();

        logger.info("Dropping service_offerings_master_list...");
        await queryRunner.query(`DROP TABLE IF EXISTS "service_offerings_master_list" CASCADE`);

        logger.info("✅ Dropped table successfully");
        await DropDataSource.destroy();
        process.exit(0);
    } catch (error) {
        logger.error("❌ Error:", error);
        process.exit(1);
    }
}

forceDropParams();
