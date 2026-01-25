import { IsInt, IsNumber, Min, Max, IsOptional, IsEnum } from "class-validator";
import { TierName } from "../../entities/PlatformFee.entity";

/**
 * DTO for updating a platform fee tier
 * All fields are optional
 */
export class UpdatePlatformFeeDto {
    @IsEnum(TierName, { message: "tier_name must be one of: basic, standard, premium, enterprise" })
    @IsOptional()
    tierName?: TierName;

    @IsInt({ message: "min_value must be an integer" })
    @Min(0, { message: "min_value must be at least 0" })
    @IsOptional()
    minValue?: number;

    @IsInt({ message: "max_value must be an integer" })
    @Min(0, { message: "max_value must be at least 0" })
    @IsOptional()
    maxValue?: number;

    @IsNumber({}, { message: "platform_fee_percentage must be a number" })
    @Min(0, { message: "platform_fee_percentage must be at least 0" })
    @Max(100, { message: "platform_fee_percentage cannot exceed 100" })
    @IsOptional()
    platformFeePercentage?: number;
}
