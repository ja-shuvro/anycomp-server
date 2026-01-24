import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { successResponse } from "../utils/response.helper";

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Returns the health status of the API and database connection
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     uptime:
 *                       type: number
 *                       description: Server uptime in seconds
 *                     database:
 *                       type: string
 *                       example: connected
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
