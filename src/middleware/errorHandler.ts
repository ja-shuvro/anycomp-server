import { Request, Response, NextFunction } from "express";

interface ErrorResponse {
    success: false;
    message: string;
    errors?: any;
    stack?: string;
}

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const isAppError = err instanceof AppError;
    const statusCode = isAppError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    const errorResponse: ErrorResponse = {
        success: false,
        message,
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === "development") {
        errorResponse.stack = err.stack;
    }

    // Log error
    console.error(`[ERROR] ${statusCode} - ${message}`);
    if (process.env.NODE_ENV === "development") {
        console.error(err.stack);
    }

    res.status(statusCode).json(errorResponse);
};
