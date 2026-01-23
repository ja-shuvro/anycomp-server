import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { AppError } from "./errorHandler";

type Constructor<T = any> = new (...args: any[]) => T;

export const validateRequest = (dtoClass: Constructor) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Transform plain object to class instance
            const dtoInstance = plainToInstance(dtoClass, req.body);

            // Validate the instance
            const errors: ValidationError[] = await validate(dtoInstance);

            if (errors.length > 0) {
                // Format validation errors
                const formattedErrors = errors.map((error) => ({
                    field: error.property,
                    constraints: error.constraints,
                }));

                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: formattedErrors,
                });
            }

            // Replace request body with validated DTO instance
            req.body = dtoInstance;
            next();
        } catch (error) {
            next(new AppError("Validation error", 400));
        }
    };
};
