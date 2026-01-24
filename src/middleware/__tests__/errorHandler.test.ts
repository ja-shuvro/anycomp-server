import { Request, Response, NextFunction } from "express";
import { AppError, errorHandler } from "../errorHandler";

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

    describe("AppError Class", () => {
        it("should create an AppError with default status code 500", () => {
            const error = new AppError("Test error");

            expect(error.message).toBe("Test error");
            expect(error.statusCode).toBe(500);
            expect(error.isOperational).toBe(true);
            expect(error).toBeInstanceOf(Error);
        });

        it("should create an AppError with custom status code", () => {
            const error = new AppError("Not found", 404);

            expect(error.message).toBe("Not found");
            expect(error.statusCode).toBe(404);
            expect(error.isOperational).toBe(true);
        });

        it("should capture stack trace", () => {
            const error = new AppError("Test error");

            expect(error.stack).toBeDefined();
        });
    });

    describe("errorHandler Function", () => {
        it("should handle AppError with custom status code", () => {
            const error = new AppError("Custom error", 400);

            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
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
                message: "Generic error",
            });
        });

        it("should include stack trace in development mode", () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = "development";

            const error = new AppError("Test error", 400);

            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
            expect(jsonCall.stack).toBeDefined();

            process.env.NODE_ENV = originalEnv;
        });

        it("should not include stack trace in production mode", () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = "production";

            const error = new AppError("Test error", 400);

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
            const error = new AppError("Test error", 404);

            errorHandler(
                error,
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining("[ERROR] 404 - Test error")
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
                message: "Internal Server Error",
            });
        });
    });
});
