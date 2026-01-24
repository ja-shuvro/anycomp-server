import { PaginationMeta } from "./response.helper";

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
    page: number;
    limit: number;
}

/**
 * Parse and validate pagination parameters from query
 */
export const parsePaginationParams = (
    page?: string | number,
    limit?: string | number
): PaginationParams => {
    const parsedPage = parseInt(String(page || "1"), 10);
    const parsedLimit = parseInt(String(limit || "10"), 10);

    return {
        page: parsedPage > 0 ? parsedPage : 1,
        limit: parsedLimit > 0 && parsedLimit <= 100 ? parsedLimit : 10,
    };
};

/**
 * Calculate offset for database query
 */
export const calculateOffset = (page: number, limit: number): number => {
    return (page - 1) * limit;
};

/**
 * Generate pagination metadata
 */
export const generatePaginationMeta = (
    currentPage: number,
    itemsPerPage: number,
    totalItems: number
): PaginationMeta => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
};
