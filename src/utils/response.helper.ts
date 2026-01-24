import { Response } from "express";

/**
 * Standard success response structure
 */
export interface SuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
}

/**
 * Standard error response structure
 */
export interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        statusCode: number;
        timestamp: string;
        path?: string;
        details?: any;
    };
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

/**
 * Paginated response data structure
 */
export interface PaginatedData<T = any> {
    items: T[];
    pagination: PaginationMeta;
}

/**
 * Send a success response
 */
export const successResponse = <T = any>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
): Response => {
    const response: SuccessResponse<T> = {
        success: true,
        data,
        ...(message && { message }),
    };
    return res.status(statusCode).json(response);
};

/**
 * Send a paginated success response
 */
export const paginatedResponse = <T = any>(
    res: Response,
    items: T[],
    pagination: PaginationMeta,
    message?: string,
    statusCode: number = 200
): Response => {
    const response: SuccessResponse<PaginatedData<T>> = {
        success: true,
        data: {
            items,
            pagination,
        },
        ...(message && { message }),
    };
    return res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
export const errorResponse = (
    res: Response,
    code: string,
    message: string,
    statusCode: number = 500,
    path?: string,
    details?: any
): Response => {
    const response: ErrorResponse = {
        success: false,
        error: {
            code,
            message,
            statusCode,
            timestamp: new Date().toISOString(),
            ...(path && { path }),
            ...(details && { details }),
        },
    };
    return res.status(statusCode).json(response);
};
