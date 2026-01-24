import {
    parsePaginationParams,
    calculateOffset,
    generatePaginationMeta,
} from "../pagination.helper";

describe("Pagination Helper Functions", () => {
    describe("parsePaginationParams", () => {
        it("should parse valid page and limit", () => {
            const result = parsePaginationParams("2", "20");

            expect(result).toEqual({
                page: 2,
                limit: 20,
            });
        });

        it("should use default values when no params provided", () => {
            const result = parsePaginationParams();

            expect(result).toEqual({
                page: 1,
                limit: 10,
            });
        });

        it("should handle string inputs", () => {
            const result = parsePaginationParams("3", "15");

            expect(result).toEqual({
                page: 3,
                limit: 15,
            });
        });

        it("should handle number inputs", () => {
            const result = parsePaginationParams(5, 25);

            expect(result).toEqual({
                page: 5,
                limit: 25,
            });
        });

        it("should default to page 1 for invalid page", () => {
            expect(parsePaginationParams("0", "10").page).toBe(1);
            expect(parsePaginationParams("-5", "10").page).toBe(1);
            expect(parsePaginationParams("invalid", "10").page).toBe(1);
        });

        it("should default to limit 10 for invalid limit", () => {
            expect(parsePaginationParams("1", "0").limit).toBe(10);
            expect(parsePaginationParams("1", "-10").limit).toBe(10);
            expect(parsePaginationParams("1", "invalid").limit).toBe(10);
        });

        it("should cap limit at 100", () => {
            expect(parsePaginationParams("1", "150").limit).toBe(10);
            expect(parsePaginationParams("1", "100").limit).toBe(100);
            expect(parsePaginationParams("1", "99").limit).toBe(99);
        });

        it("should handle undefined values", () => {
            const result = parsePaginationParams(undefined, undefined);

            expect(result).toEqual({
                page: 1,
                limit: 10,
            });
        });

        it("should handle mixed valid and invalid values", () => {
            expect(parsePaginationParams("5", "invalid")).toEqual({
                page: 5,
                limit: 10,
            });

            expect(parsePaginationParams("invalid", "20")).toEqual({
                page: 1,
                limit: 20,
            });
        });
    });

    describe("calculateOffset", () => {
        it("should calculate offset for page 1", () => {
            expect(calculateOffset(1, 10)).toBe(0);
        });

        it("should calculate offset for page 2", () => {
            expect(calculateOffset(2, 10)).toBe(10);
        });

        it("should calculate offset for page 3 with limit 20", () => {
            expect(calculateOffset(3, 20)).toBe(40);
        });

        it("should calculate offset for various page/limit combinations", () => {
            expect(calculateOffset(1, 5)).toBe(0);
            expect(calculateOffset(2, 5)).toBe(5);
            expect(calculateOffset(5, 10)).toBe(40);
            expect(calculateOffset(10, 25)).toBe(225);
        });

        it("should handle limit of 1", () => {
            expect(calculateOffset(1, 1)).toBe(0);
            expect(calculateOffset(5, 1)).toBe(4);
        });
    });

    describe("generatePaginationMeta", () => {
        it("should generate metadata for first page", () => {
            const meta = generatePaginationMeta(1, 10, 50);

            expect(meta).toEqual({
                currentPage: 1,
                totalPages: 5,
                totalItems: 50,
                itemsPerPage: 10,
                hasNextPage: true,
                hasPrevPage: false,
            });
        });

        it("should generate metadata for middle page", () => {
            const meta = generatePaginationMeta(3, 10, 50);

            expect(meta).toEqual({
                currentPage: 3,
                totalPages: 5,
                totalItems: 50,
                itemsPerPage: 10,
                hasNextPage: true,
                hasPrevPage: true,
            });
        });

        it("should generate metadata for last page", () => {
            const meta = generatePaginationMeta(5, 10, 50);

            expect(meta).toEqual({
                currentPage: 5,
                totalPages: 5,
                totalItems: 50,
                itemsPerPage: 10,
                hasNextPage: false,
                hasPrevPage: true,
            });
        });

        it("should handle single page", () => {
            const meta = generatePaginationMeta(1, 10, 5);

            expect(meta).toEqual({
                currentPage: 1,
                totalPages: 1,
                totalItems: 5,
                itemsPerPage: 10,
                hasNextPage: false,
                hasPrevPage: false,
            });
        });

        it("should handle zero items", () => {
            const meta = generatePaginationMeta(1, 10, 0);

            expect(meta).toEqual({
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                itemsPerPage: 10,
                hasNextPage: false,
                hasPrevPage: false,
            });
        });

        it("should calculate total pages correctly with remainder", () => {
            const meta = generatePaginationMeta(1, 10, 45);

            expect(meta.totalPages).toBe(5); // 45 items / 10 per page = 4.5 -> 5 pages
        });

        it("should handle large datasets", () => {
            const meta = generatePaginationMeta(50, 100, 10000);

            expect(meta).toEqual({
                currentPage: 50,
                totalPages: 100,
                totalItems: 10000,
                itemsPerPage: 100,
                hasNextPage: true,
                hasPrevPage: true,
            });
        });

        it("should handle small items per page", () => {
            const meta = generatePaginationMeta(2, 1, 5);

            expect(meta).toEqual({
                currentPage: 2,
                totalPages: 5,
                totalItems: 5,
                itemsPerPage: 1,
                hasNextPage: true,
                hasPrevPage: true,
            });
        });
    });
});
