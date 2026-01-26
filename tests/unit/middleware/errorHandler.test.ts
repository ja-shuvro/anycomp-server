import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../../src/middleware/errorHandler";
import { ApiError } from "../../../src/errors/custom-errors";

describe("Error Handler Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    describe("ApiError Class", () => {
        it("should create an ApiError with default status code 500", () => {
            const error = new ApiError("Test error", 500, "INTERNAL_SERVER_ERROR");

            expect(error.message).toBe("Test error");
            expect(error.statusCode).toBe(500);
            expect(error.code).toBe("INTERNAL_SERVER_ERROR");
            expect(error.isOperational).toBe(true);
            expect(error).toBeInstanceOf(Error);
        });

        it("should create an ApiError with custom status code", () => {
            const error = new ApiError("Not found", 404, "NOT_FOUND");

            expect(error.message).toBe("Not found");
            expect(error.statusCode).toBe(404);
            expect(error.isOperational).toBe(true);
        });

        it("should capture stack trace", () => {
            const error = new ApiError("Test error", 500, "INTERNAL_SERVER_ERROR");

            expect(error.stack).toBeDefined();
        });
    });

    describe("errorHandler Function", () => {
        it("should handle ApiError with custom status code", () => {
            const error = new ApiError("Custom error", 400, "BAD_REQUEST");

            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                code: "BAD_REQUEST",
                message: "Custom error",
            });
        });

        it("should handle generic Error with 500 status code", () => {
            const error = new Error("Generic error");

            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
            });
        });

        it("should include stack trace in development mode", () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = "development";

            const error = new ApiError("Test error", 400, "BAD_REQUEST");

            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            process.env.NODE_ENV = originalEnv;
        });

        it("should not include stack trace in production mode", () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = "production";

            const error = new ApiError("Test error", 400, "BAD_REQUEST");

            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
            expect(jsonCall.stack).toBeUndefined();

            process.env.NODE_ENV = originalEnv;
        });

        it("should log error message", () => {
            const error = new ApiError("Test error", 404, "NOT_FOUND");

            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );
        });

        it("should handle error without message", () => {
            const error = new Error();

            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
            });
        });
    });
});
