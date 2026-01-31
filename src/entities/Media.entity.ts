import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from "typeorm";
import { IsString, IsNotEmpty, IsInt, IsEnum, Min } from "class-validator";
import { Specialist } from "./Specialist.entity";

export enum MimeType {
    IMAGE_JPEG = "image/jpeg",
    IMAGE_PNG = "image/png",
    IMAGE_WEBP = "image/webp",
    VIDEO_MP4 = "video/mp4",
    APPLICATION_PDF = "application/pdf",
}

export enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
    DOCUMENT = "document",
}

/**
 * Media Entity
 * Files associated with specialists (images, videos, documents)
 */
@Entity("media")
@Index(["specialists"])
@Index(["displayOrder"])
export class Media {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid", name: "specialists", nullable: true })
    specialists: string | null;

    @Column({ type: "varchar", length: 255, name: "file_name" })
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @Column({ type: "int", name: "file_size" })
    @IsInt()
    @Min(1)
    fileSize: number;

    @Column({ type: "int", name: "display_order", default: 0 })
    @IsInt()
    @Min(0)
    displayOrder: number;

    @Column({
        type: "enum",
        enum: MimeType,
        name: "mime_type",
    })
    @IsEnum(MimeType)
    mimeType: MimeType;

    @Column({
        type: "enum",
        enum: MediaType,
        name: "media_type",
    })
    @IsEnum(MediaType)
    mediaType: MediaType;

    @Column({ type: "timestamp", name: "uploaded_at" })
    uploadedAt: Date;

    @Column({ type: "varchar", length: 500, nullable: true, name: "s3_key" })
    s3Key?: string;

    @Column({ type: "varchar", length: 100, nullable: true, name: "bucket_name" })
    bucketName?: string;

    @Column({ type: "varchar", length: 1000, nullable: true, name: "public_url" })
    publicUrl?: string;

    @DeleteDateColumn({ name: "deleted_at", nullable: true })
    deletedAt?: Date;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // Relationships
    @ManyToOne(() => Specialist, (specialist) => specialist.media, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "specialists" })
    specialist: Specialist;
}
