import { AppDataSource } from "../data-source";
import logger from "../utils/logger";

/**
 * Verify database schema
 */
async function verifySchema() {
    try {
        await AppDataSource.initialize();
        logger.info("✅ Database connected");

        // Get all tables
        const queryRunner = AppDataSource.createQueryRunner();

        logger.info("\n📊 Checking tables...");
        const tables = await queryRunner.query(`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname='public' 
            ORDER BY tablename
        `);
        logger.info(`Found ${tables.length} tables:`);
        tables.forEach((table: any) => logger.info(`  - ${table.tablename}`));

        logger.info("\n🔗 Checking foreign keys...");
        const foreignKeys = await queryRunner.query(`
            SELECT 
                tc.table_name, 
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
            ORDER BY tc.table_name
        `);
        logger.info(`Found ${foreignKeys.length} foreign keys:`);
        foreignKeys.forEach((fk: any) =>
            logger.info(`  - ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`)
        );

        logger.info("\n📇 Checking indexes...");
        const indexes = await queryRunner.query(`
            SELECT 
                tablename, 
                indexname, 
                indexdef
            FROM pg_indexes 
            WHERE schemaname='public'
            ORDER BY tablename, indexname
        `);
        logger.info(`Found ${indexes.length} indexes`);

        logger.info("\n📊 Checking platform fees...");
        const platformFees = await queryRunner.query(`SELECT * FROM platform_fee ORDER BY min_value`);
        logger.info(`Found ${platformFees.length} platform fee tiers:`);
        platformFees.forEach((fee: any) =>
            logger.info(`  - ${fee.tier_name}: $${fee.min_value}-$${fee.max_value} @ ${fee.platform_fee_percentage}%`)
        );

        logger.info("\n🛠️  Checking service offerings...");
        const services = await queryRunner.query(`SELECT * FROM service_offerings_master_list`);
        logger.info(`Found ${services.length} service offerings:`);
        services.forEach((service: any) =>
            logger.info(`  - ${service.title}`)
        );

        await queryRunner.release();
        await AppDataSource.destroy();
        logger.info("\n✅ Schema verification complete!");
        process.exit(0);
    } catch (error) {
        logger.error("❌ Verification failed:", error);
        process.exit(1);
    }
}

verifySchema();
