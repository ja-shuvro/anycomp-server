import { DataSource } from "typeorm";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

/**
 * Drop ALL tables to reset database
 */
async function resetDatabase() {
    const DropDataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASS || "postgres",
        database: process.env.DB_NAME || "anycomp_db",
        synchronize: false,
        logging: false,
    });

    try {
        await DropDataSource.initialize();
        const queryRunner = DropDataSource.createQueryRunner();

        logger.info("🗑️  Dropping all tables...");
        await queryRunner.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);

        logger.info("✅ Database reset successfully");
        await DropDataSource.destroy();
        process.exit(0);
    } catch (error) {
        logger.error("❌ Reset failed:", error);
        process.exit(1);
    }
}

resetDatabase();
