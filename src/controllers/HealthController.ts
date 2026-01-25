import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { successResponse } from "../utils/response.helper";

/**
 * Health Controller
 * Handles health check requests
 * 
 * @see ../swagger/paths/health.docs.ts for API documentation
 */
export class HealthController {
    /**
     * Health check endpoint
     */
    static async check(req: Request, res: Response) {
        const healthData = {
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: AppDataSource.isInitialized ? "connected" : "disconnected",
        };

        return successResponse(res, healthData);
    }
}
