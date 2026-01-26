import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../validateRequest";
import { IsString, IsEmail, MinLength } from "class-validator";
import { ApiError } from "../../errors/custom-errors";

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

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: "Validation failed",
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        field: "email",
                        constraints: expect.any(Object),
                    }),
                ]),
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
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

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: "Validation failed",
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                    }),
                ]),
            })
        );
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

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
        expect(jsonCall.errors).toHaveLength(2);
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

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: "Validation failed",
            })
        );
    });
});
