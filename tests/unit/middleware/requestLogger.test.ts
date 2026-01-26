import { Request, Response, NextFunction } from "express";
import { requestLogger } from "../../../src/middleware/requestLogger";
import logger from "../../../src/utils/logger";

// Mock the logger
jest.mock("../../../src/utils/logger", () => ({
    __esModule: true,
    default: {
        http: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
    },
}));

describe("Request Logger Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRequest = {
            method: "GET",
            originalUrl: "/api/v1/test",
        };

        mockResponse = {
            statusCode: 200,
            json: jest.fn().mockReturnThis(),
        };

        mockNext = jest.fn();
    });

    it("should log incoming request", () => {
        requestLogger(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(logger.http).toHaveBeenCalledWith("Incoming GET /api/v1/test");
    });

    it("should call next middleware", () => {
        requestLogger(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toHaveBeenCalled();
    });

    it("should log successful response (200-299)", () => {
        mockResponse.statusCode = 200;

        requestLogger(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        // Simulate response
        (mockResponse.json as jest.Mock)({ success: true });

        expect(logger.http).toHaveBeenCalledWith(
            expect.stringContaining("GET /api/v1/test - 200")
        );
    });

    it("should log client error response (400-499)", () => {
        mockResponse.statusCode = 404;

        requestLogger(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        // Simulate response
        (mockResponse.json as jest.Mock)({ success: false });

        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("GET /api/v1/test - 404")
        );
    });

    it("should log server error response (500+)", () => {
        mockResponse.statusCode = 500;

        requestLogger(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        // Simulate response
        (mockResponse.json as jest.Mock)({ success: false });

        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining("GET /api/v1/test - 500")
        );
    });

    it("should include response time in log", (done) => {
        requestLogger(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        // Delay response to measure time
        setTimeout(() => {
            (mockResponse.json as jest.Mock)({ success: true });

            const logCall = (logger.http as jest.Mock).mock.calls[1][0];
            expect(logCall).toMatch(/\d+ms$/);
            done();
        }, 10);
    });

    it("should preserve original json functionality", () => {
        const responseData = { success: true, data: "test" };

        requestLogger(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        const result = (mockResponse.json as jest.Mock)(responseData);

        expect(result).toBe(mockResponse);
    });
});
