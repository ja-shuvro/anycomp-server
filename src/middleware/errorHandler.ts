import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/custom-errors";
import { errorResponse } from "../utils/response.helper";
import logger from "../utils/logger";

/**
 * Global error handler middleware
 * Catches all errors and returns standardized error responses
 */
export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Handle custom API errors
    if (err instanceof ApiError) {
        logger.warn(`API Error: [${err.code}] ${err.message} - ${req.method} ${req.path}`);

        return errorResponse(
            res,
            err.code,
            err.message,
            err.statusCode,
            req.path,
            (err as any).details
        );
    }

    // Handle validation errors from class-validator
    if ((err as any).errors && Array.isArray((err as any).errors)) {
        logger.warn(`Validation Error: ${req.method} ${req.path}`);

        return errorResponse(
            res,
            "VALIDATION_ERROR",
            "Request validation failed",
            422,
            req.path,
            (err as any).errors
        );
    }

    // Handle unknown errors
    logger.error(`Unhandled Error: ${err.message}`, {
        method: req.method,
        path: req.path,
        stack: err.stack,
    });

    // Don't expose internal error details in production
    const message =
        process.env.NODE_ENV === "development" ? err.message : "Internal server error";

    return errorResponse(res, "INTERNAL_SERVER_ERROR", message, 500, req.path);
};
