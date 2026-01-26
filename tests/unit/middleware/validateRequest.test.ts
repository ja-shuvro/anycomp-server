import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../../../src/middleware/validateRequest";
import { IsString, IsEmail, MinLength } from "class-validator";
import { ValidationError } from "../../../src/errors/custom-errors";

// Sample DTO for testing
class TestDTO {
    @IsString()
    @MinLength(3)
    name!: string;

    @IsEmail()
    email!: string;
}

describe("Validate Request Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            body: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockNext = jest.fn();
    });

    it("should pass validation with valid data", async () => {
        mockRequest.body = {
            name: "John Doe",
            email: "john@example.com",
        };

        const middleware = validateRequest(TestDTO);

        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should fail validation with invalid email", async () => {
        mockRequest.body = {
            name: "John Doe",
            email: "invalid-email",
        };

        const middleware = validateRequest(TestDTO);

        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
        const error = (mockNext as jest.Mock).mock.calls[0][0];
        expect(error.statusCode).toBe(422);
        expect(error.details).toEqual(expect.arrayContaining([
            expect.objectContaining({
                field: "email",
            }),
        ]));
    });

    it("should fail validation with short name", async () => {
        mockRequest.body = {
            name: "Jo",
            email: "john@example.com",
        };

        const middleware = validateRequest(TestDTO);

        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
        const error = (mockNext as jest.Mock).mock.calls[0][0];
        expect(error.details).toEqual(expect.arrayContaining([
            expect.objectContaining({
                field: "name",
            }),
        ]));
    });

    it("should fail validation with multiple errors", async () => {
        mockRequest.body = {
            name: "Jo",
            email: "invalid-email",
        };

        const middleware = validateRequest(TestDTO);

        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
        const error = (mockNext as jest.Mock).mock.calls[0][0];
        expect(error.details).toHaveLength(2);
    });

    it("should replace request body with validated DTO instance", async () => {
        mockRequest.body = {
            name: "John Doe",
            email: "john@example.com",
            extraField: "should be preserved",
        };

        const middleware = validateRequest(TestDTO);

        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockRequest.body).toBeInstanceOf(TestDTO);
        expect(mockNext).toHaveBeenCalled();
    });

    it("should fail validation with empty body", async () => {
        mockRequest.body = {};

        const middleware = validateRequest(TestDTO);

        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
    });
});
