import "reflect-metadata";
import { app } from "../src/server";
import { AppDataSource } from "../src/data-source";
import logger from "../src/utils/logger";

/**
 * Serverless entry point for Vercel
 */
export default async (req: any, res: any) => {
    try {
        // Ensure database is connected
        if (!AppDataSource.isInitialized) {
            logger.info("Connecting to database in serverless function...");
            await AppDataSource.initialize();
            logger.info("✅ Database connection established (Serverless)");
        }

        // Let Express handle the request
        return app(req, res);
    } catch (error: any) {
        logger.error("❌ Critical error in serverless execution:", error);

        // Provide enough info to debug in Vercel logs
        res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred during serverless execution",
                details: error.message || "Unknown error",
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined
            }
        });
    }
};
