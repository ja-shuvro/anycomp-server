/**
 * Base API Error class
 */
export class ApiError extends Error {
    public statusCode: number;
    public code: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, code: string, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends ApiError {
    constructor(message: string, code = "BAD_REQUEST") {
        super(message, 400, code);
    }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends ApiError {
    constructor(message: string, code = "NOT_FOUND") {
        super(message, 404, code);
    }
}

/**
 * 409 Conflict
 */
export class ConflictError extends ApiError {
    constructor(message: string, code = "CONFLICT") {
        super(message, 409, code);
    }
}

/**
 * 422 Validation Error
 */
export class ValidationError extends ApiError {
    public details?: any;

    constructor(message: string, details?: any, code = "VALIDATION_ERROR") {
        super(message, 422, code);
        this.details = details;
    }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends ApiError {
    constructor(message: string, code = "UNAUTHORIZED") {
        super(message, 401, code);
    }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends ApiError {
    constructor(message: string, code = "FORBIDDEN") {
        super(message, 403, code);
    }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends ApiError {
    constructor(message: string, code = "INTERNAL_SERVER_ERROR") {
        super(message, 500, code, false);
    }
}
