import { IsUUID, IsInt, Min, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

/**
 * DTO for updating media
 */
export class UpdateMediaDto {
    @IsUUID()
    @IsOptional()
    specialistId?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    displayOrder?: number;
}
