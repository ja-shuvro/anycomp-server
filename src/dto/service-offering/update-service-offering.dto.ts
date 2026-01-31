import { IsString, IsNotEmpty, IsOptional, Length, IsUUID } from "class-validator";

/**
 * DTO for updating a service offering
 */
export class UpdateServiceOfferingDto {
    @IsString()
    @IsOptional()
    @Length(2, 255)
    title?: string;

    @IsString()
    @IsOptional()
    @Length(10, 5000)
    description?: string;

    @IsString()
    @IsOptional()
    s3Key?: string;

    @IsString()
    @IsOptional()
    bucketName?: string;

    @IsUUID("4")
    @IsOptional()
    specialistId?: string;
}
