import { IsString, IsNotEmpty, IsOptional, Length, IsUUID } from "class-validator";

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

    @IsString({ message: "Specialist ID must be a string" })
    @IsNotEmpty({ message: "Specialist ID is required" })
    @IsUUID("4", { message: "Specialist ID must be a valid UUID" })
    specialistId: string;

    @IsString()
    @IsOptional()
    s3Key?: string;

    @IsString()
    @IsOptional()
    bucketName?: string;
}
