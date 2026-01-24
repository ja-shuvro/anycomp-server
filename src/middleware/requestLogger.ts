import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/**
 * Request logger middleware
 * Logs HTTP method, URL, status code, response time, and user agent
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Log request
    logger.http(`Incoming ${req.method} ${req.originalUrl}`);

    // Override res.json to log response
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
        const duration = Date.now() - start;
        const logMessage = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 500) {
            logger.error(logMessage);
        } else if (res.statusCode >= 400) {
            logger.warn(logMessage);
        } else {
            logger.http(logMessage);
        }

        return originalJson(body);
    };

    next();
};
