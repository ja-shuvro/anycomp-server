import "reflect-metadata";
import { app } from "../src/server";
import { AppDataSource } from "../src/data-source";
import logger from "../src/utils/logger";

/**
 * Serverless entry point for Vercel
 */
export default async (req: any, res: any) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            logger.info("✅ Database connection established (Serverless)");
        }
        return app(req, res);
    } catch (error) {
        logger.error("❌ Error in serverless execution:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred during serverless execution",
            }
        });
    }
};
