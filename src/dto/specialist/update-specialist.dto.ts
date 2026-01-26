import { IsString, IsNumber, IsOptional, Length, Min, IsBoolean, IsEnum } from "class-validator";
import { VerificationStatus } from "../../entities/Specialist.entity";

/**
 * DTO for updating a specialist
 */
export class UpdateSpecialistDto {
    @IsString()
    @IsOptional()
    @Length(2, 200)
    title?: string;

    @IsString()
    @IsOptional()
    @Length(10, 5000)
    description?: string;

    @IsNumber()
    @IsOptional()
    @Min(0.01)
    basePrice?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    durationDays?: number;

    @IsString()
    @IsOptional()
    @Length(3, 255)
    slug?: string;

    @IsBoolean()
    @IsOptional()
    isDraft?: boolean;

    @IsEnum(VerificationStatus)
    @IsOptional()
    verificationStatus?: VerificationStatus;
}
