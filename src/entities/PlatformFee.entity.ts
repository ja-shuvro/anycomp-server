import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";
import { IsEnum, IsInt, IsNumber, Min, Max } from "class-validator";

export enum TierName {
    BASIC = "basic",
    STANDARD = "standard",
    PREMIUM = "premium",
    ENTERPRISE = "enterprise",
}

/**
 * Platform Fee Entity
 * Defines fee tiers based on price ranges
 */
@Entity("platform_fee")
@Index(["tierName", "minValue", "maxValue"])
export class PlatformFee {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "enum",
        enum: TierName,
        name: "tier_name",
    })
    @IsEnum(TierName)
    tierName: TierName;

    @Column({ type: "int", name: "min_value" })
    @IsInt()
    @Min(0)
    minValue: number;

    @Column({ type: "int", name: "max_value" })
    @IsInt()
    @Min(0)
    maxValue: number;

    @Column({ type: "decimal", precision: 5, scale: 2, name: "platform_fee_percentage" })
    @IsNumber()
    @Min(0)
    @Max(100)
    platformFeePercentage: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
