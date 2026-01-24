import {
    successResponse,
    paginatedResponse,
    errorResponse,
    PaginationMeta,
} from "../response.helper";
import { Response } from "express";

describe("Response Helper Functions", () => {
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    describe("successResponse", () => {
        it("should send success response with data", () => {
            const data = { id: 1, name: "Test" };

            successResponse(mockResponse as Response, data);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data,
            });
        });

        it("should send success response with custom message", () => {
            const data = { id: 1 };
            const message = "Created successfully";

            successResponse(mockResponse as Response, data, message);

            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data,
                message,
            });
        });

        it("should send success response with custom status code", () => {
            const data = { id: 1 };

            successResponse(mockResponse as Response, data, undefined, 201);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
        });

        it("should handle empty data object", () => {
            successResponse(mockResponse as Response, {});

            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: {},
            });
        });

        it("should handle array data", () => {
            const data = [1, 2, 3];

            successResponse(mockResponse as Response, data);

            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data,
            });
        });
    });

    describe("paginatedResponse", () => {
        const mockPagination: PaginationMeta = {
            currentPage: 1,
            totalPages: 5,
            totalItems: 50,
            itemsPerPage: 10,
            hasNextPage: true,
            hasPrevPage: false,
        };

        it("should send paginated response with items and metadata", () => {
            const items = [{ id: 1 }, { id: 2 }];

            paginatedResponse(mockResponse as Response, items, mockPagination);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    items,
                    pagination: mockPagination,
                },
            });
        });

        it("should send paginated response with message", () => {
            const items = [{ id: 1 }];
            const message = "Items retrieved successfully";

            paginatedResponse(
                mockResponse as Response,
                items,
                mockPagination,
                message
            );

            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    items,
                    pagination: mockPagination,
                },
                message,
            });
        });

        it("should send paginated response with custom status code", () => {
            const items = [{ id: 1 }];

            paginatedResponse(
                mockResponse as Response,
                items,
                mockPagination,
                undefined,
                201
            );

            expect(mockResponse.status).toHaveBeenCalledWith(201);
        });

        it("should handle empty items array", () => {
            paginatedResponse(mockResponse as Response, [], mockPagination);

            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    items: [],
                    pagination: mockPagination,
                },
            });
        });
    });

    describe("errorResponse", () => {
        it("should send error response with basic info", () => {
            errorResponse(
                mockResponse as Response,
                "NOT_FOUND",
                "Resource not found"
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: "Resource not found",
                    statusCode: 500,
                    timestamp: expect.any(String),
                },
            });
        });

        it("should send error response with custom status code", () => {
            errorResponse(
                mockResponse as Response,
                "VALIDATION_ERROR",
                "Invalid input",
                400
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: expect.objectContaining({
                    code: "VALIDATION_ERROR",
                    statusCode: 400,
                }),
            });
        });

        it("should include path in error response", () => {
            errorResponse(
                mockResponse as Response,
                "NOT_FOUND",
                "Resource not found",
                404,
                "/api/v1/specialists/999"
            );

            const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
            expect(jsonCall.error.path).toBe("/api/v1/specialists/999");
        });

        it("should include details in error response", () => {
            const details = { field: "email", reason: "invalid format" };

            errorResponse(
                mockResponse as Response,
                "VALIDATION_ERROR",
                "Validation failed",
                400,
                undefined,
                details
            );

            const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
            expect(jsonCall.error.details).toEqual(details);
        });

        it("should include timestamp in ISO format", () => {
            errorResponse(
                mockResponse as Response,
                "ERROR",
                "Something went wrong"
            );

            const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
            const timestamp = new Date(jsonCall.error.timestamp);
            expect(timestamp.toString()).not.toBe("Invalid Date");
        });

        it("should include both path and details", () => {
            const path = "/api/v1/test";
            const details = { extra: "info" };

            errorResponse(
                mockResponse as Response,
                "ERROR",
                "Error message",
                500,
                path,
                details
            );

            const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
            expect(jsonCall.error.path).toBe(path);
            expect(jsonCall.error.details).toEqual(details);
        });
    });
});
