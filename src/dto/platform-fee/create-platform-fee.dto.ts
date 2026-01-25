import { IsEnum, IsInt, IsNumber, Min, Max, IsNotEmpty } from "class-validator";
import { TierName } from "../../entities/PlatformFee.entity";

/**
 * DTO for creating a platform fee tier
 */
export class CreatePlatformFeeDto {
    @IsEnum(TierName, { message: "tier_name must be one of: basic, standard, premium, enterprise" })
    @IsNotEmpty()
    tierName: TierName;

    @IsInt({ message: "min_value must be an integer" })
    @Min(0, { message: "min_value must be at least 0" })
    @IsNotEmpty()
    minValue: number;

    @IsInt({ message: "max_value must be an integer" })
    @Min(0, { message: "max_value must be at least 0" })
    @IsNotEmpty()
    maxValue: number;

    @IsNumber({}, { message: "platform_fee_percentage must be a number" })
    @Min(0, { message: "platform_fee_percentage must be at least 0" })
    @Max(100, { message: "platform_fee_percentage cannot exceed 100" })
    @IsNotEmpty()
    platformFeePercentage: number;
}
