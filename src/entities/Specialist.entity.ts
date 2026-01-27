import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    Index,
    BeforeInsert,
    BeforeUpdate,
    Check,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsBoolean,
    IsEnum,
    IsInt,
    Min,
    Max,
    Length,
} from "class-validator";
import { ServiceOffering } from "../entities/ServiceOffering.entity";
import { Media } from "../entities/Media.entity";
import { User } from "./User.entity";

export enum VerificationStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    REJECTED = "rejected",
}

/**
 * Specialist Entity
 * Core entity for specialist management
 */
@Entity("specialists")
@Index(["slug"], { unique: true })
@Index(["isDraft"])
@Index(["verificationStatus"])
@Index(["averageRating"])
@Index(["isDraft", "verificationStatus"])
@Index(["isDraft", "createdAt"])
@Check(`"base_price" > 0`)
@Check(`"duration_days" > 0`)
@Check(`"average_rating" >= 0 AND "average_rating" <= 5`)
export class Specialist {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 200 })
    @IsString()
    @IsNotEmpty()
    @Length(2, 200)
    title: string;

    @Column({ type: "varchar", length: 255, unique: true })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @Column({ type: "text" })
    @IsString()
    @IsNotEmpty()
    @Length(10)
    description: string;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "base_price" })
    @IsNumber()
    @Min(0.01)
    basePrice: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "platform_fee", default: 0 })
    @IsNumber()
    @Min(0)
    platformFee: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "final_price", default: 0 })
    @IsNumber()
    @Min(0)
    finalPrice: number;

    @Column({
        type: "decimal",
        precision: 3,
        scale: 2,
        name: "average_rating",
        default: 0,
    })
    @IsNumber()
    @Min(0)
    @Max(5)
    averageRating: number;

    @Column({ type: "int", name: "total_number_of_ratings", default: 0 })
    @IsInt()
    @Min(0)
    totalNumberOfRatings: number;

    @Column({ type: "boolean", name: "is_draft", default: true })
    @IsBoolean()
    isDraft: boolean;

    @Column({
        type: "enum",
        enum: VerificationStatus,
        name: "verification_status",
        default: VerificationStatus.PENDING,
    })
    @IsEnum(VerificationStatus)
    verificationStatus: VerificationStatus;

    @Column({ type: "boolean", name: "is_verified", default: false })
    @IsBoolean()
    isVerified: boolean;

    @Column({ type: "int", name: "duration_days" })
    @IsInt()
    @Min(1)
    durationDays: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", nullable: true })
    deletedAt?: Date;

    // Relationships
    @OneToMany(() => ServiceOffering, (serviceOffering) => serviceOffering.specialist, {
        cascade: true,
    })
    serviceOfferings: ServiceOffering[];

    @OneToMany(() => Media, (media) => media.specialist, {
        cascade: true,
    })
    media: Media[];

    @ManyToOne(() => User, (user) => user.specialists)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "user_id", nullable: true })
    userId: string;

    /**
     * Update isVerified based on verificationStatus
     */
    @BeforeInsert()
    @BeforeUpdate()
    updateVerifiedStatus() {
        this.isVerified = this.verificationStatus === VerificationStatus.VERIFIED;
    }
}
