import { IsString, IsOptional, IsEnum, IsNumber, Min } from "class-validator";
import { VerificationStatus } from "../../entities/Specialist.entity";
import { Transform } from "class-transformer";

/**
 * DTO for filtering specialists
 */
export class FilterSpecialistDto {
    @IsString()
    @IsOptional()
    search?: string;

    @IsEnum(VerificationStatus)
    @IsOptional()
    status?: VerificationStatus;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    isDraft?: boolean;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    minPrice?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    maxPrice?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    minRating?: number;

    @IsString()
    @IsOptional()
    @IsEnum(['price', 'rating', 'newest', 'alphabetical'])
    sortBy?: 'price' | 'rating' | 'newest' | 'alphabetical';

    @IsString()
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';
}
