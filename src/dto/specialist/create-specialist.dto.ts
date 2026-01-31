import { IsString, IsNotEmpty, IsNumber, IsOptional, Length, Min, IsArray, IsUUID, ValidateIf } from "class-validator";

/**
 * DTO for creating a new specialist
 */
export class CreateSpecialistDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 200)
    title: string;

    @IsString()
    @IsNotEmpty()
    @Length(10, 5000)
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0.01)
    basePrice: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    durationDays: number;

    @IsString()
    @IsOptional()
    @ValidateIf((o) => o.slug && o.slug.length > 0)
    @Length(3, 255)
    slug?: string;

    @IsArray()
    @IsUUID("4", { each: true })
    @IsOptional()
    serviceIds?: string[];
}
