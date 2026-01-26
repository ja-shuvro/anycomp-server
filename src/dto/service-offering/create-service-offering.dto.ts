import { IsString, IsNotEmpty, IsOptional, Length, Matches } from "class-validator";

/**
 * DTO for creating a service offering
 */
export class CreateServiceOfferingDto {
    @IsString({ message: "Title must be a string" })
    @IsNotEmpty({ message: "Title is required" })
    @Length(2, 255, { message: "Title must be between 2 and 255 characters" })
    title: string;

    @IsString({ message: "Description must be a string" })
    @IsNotEmpty({ message: "Description is required" })
    @Length(10, 5000, { message: "Description must be at least 10 characters" })
    description: string;

    @IsString({ message: "Service ID must be a string" })
    @IsNotEmpty({ message: "Service ID is required" })
    @Length(3, 100, { message: "Service ID must be between 3 and 100 characters" })
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: "Service ID can only contain letters, numbers, underscores, and hyphens" })
    serviceId: string;

    @IsString()
    @IsOptional()
    s3Key?: string;

    @IsString()
    @IsOptional()
    bucketName?: string;
}
