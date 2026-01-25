import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError as ClassValidationError } from "class-validator";
import { ValidationError } from "../errors/custom-errors";

/**
 * Validation middleware
 * Validates request body against a DTO class using class-validator
 */
export const validateRequest = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Transform plain object to class instance
            const dtoInstance = plainToInstance(dtoClass, req.body);

            // Validate
            const errors: ClassValidationError[] = await validate(dtoInstance);

            if (errors.length > 0) {
                // Format validation errors
                const formattedErrors = errors.map((error) => ({
                    field: error.property,
                    constraints: error.constraints,
                    value: error.value,
                }));

                throw new ValidationError(
                    "Request validation failed",
                    formattedErrors,
                    "VALIDATION_ERROR"
                );
            }

            // Attach validated DTO to request
            req.body = dtoInstance;
            next();
        } catch (error) {
            next(error);
        }
    };
};
