import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
} from "typeorm";
import { IsString, IsNotEmpty, IsOptional, Length } from "class-validator";
import { ServiceOffering } from "./ServiceOffering.entity";

/**
 * Service Offerings Master List Entity
 * Master list of all available services
 */
@Entity("service_offerings_master_list")
export class ServiceOfferingsMasterList {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    @IsString()
    @IsNotEmpty()
    @Length(2, 255)
    title: string;

    @Column({ type: "text" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @Index("idx_service_offerings_service_id", { unique: true })
    @Column({ type: "varchar", length: 100, name: "service_id" })
    @IsString()
    @IsNotEmpty()
    serviceId: string;

    @Column({ type: "varchar", length: 500, nullable: true, name: "s3_key" })
    @IsString()
    @IsOptional()
    s3Key?: string;

    @Column({ type: "varchar", length: 255, nullable: true, name: "bucket_name" })
    @IsString()
    @IsOptional()
    bucketName?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // Relationships
    @OneToMany(() => ServiceOffering, (serviceOffering) => serviceOffering.serviceOfferingsMasterList)
    serviceOfferings: ServiceOffering[];
}
