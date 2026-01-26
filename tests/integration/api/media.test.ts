import request from "supertest";
import path from "path";
import fs from "fs";
import { Specialist } from "../../../src/entities/Specialist.entity";
import { Media, MimeType, MediaType } from "../../../src/entities/Media.entity";
import { AppDataSource } from "../../../src/data-source";
import { app } from "../../../src/server";

describe("Media API Integration", () => {
    let specialistId: string;
    const testFilePath = path.join(__dirname, "test-image.jpg");

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        // Create a dummy image file for testing
        fs.writeFileSync(testFilePath, "dummy content");
    });

    afterAll(async () => {
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });

    beforeEach(async () => {
        await AppDataSource.query('DELETE FROM service_offerings');
        await AppDataSource.query('DELETE FROM media');
        await AppDataSource.query('DELETE FROM specialists');

        const repo = AppDataSource.getRepository(Specialist);
        const saved = await repo.save(repo.create({
            title: "Test Specialist", description: "Bio Bio Bio Bio Bio Bio Bio Bio Bio Bio",
            basePrice: 100, isDraft: true, durationDays: 1,
            platformFee: 5, slug: "test-specialist"
        }));
        specialistId = saved.id;
    });

    describe("POST /api/v1/media/upload", () => {
        it("should upload a media file", async () => {
            const response = await request(app)
                .post("/api/v1/media/upload")
                .attach("file", testFilePath)
                .field("specialistId", specialistId)
                .field("displayOrder", 1);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);

            // Cleanup: remove physically uploaded file if it exists
            const uploadedPath = path.join(process.cwd(), "uploads", response.body.data.fileName);
            if (fs.existsSync(uploadedPath)) {
                fs.unlinkSync(uploadedPath);
            }
        });
    });

    describe("GET /api/v1/media/specialist/:specialistId", () => {
        it("should return media for a specialist", async () => {
            const repo = AppDataSource.getRepository(Media);
            await repo.save(repo.create({
                specialists: specialistId,
                fileName: "test.jpg",
                fileSize: 1024,
                displayOrder: 1,
                mimeType: MimeType.IMAGE_JPEG,
                mediaType: MediaType.IMAGE,
                publicUrl: "/uploads/test.jpg",
                uploadedAt: new Date()
            }));

            const response = await request(app).get(`/api/v1/media/specialist/${specialistId}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
        });
    });

    describe("PATCH /api/v1/media/:id/reorder", () => {
        it("should reorder media", async () => {
            const repo = AppDataSource.getRepository(Media);
            const saved = await repo.save(repo.create({
                specialists: specialistId,
                fileName: "test.jpg",
                fileSize: 1024,
                displayOrder: 1,
                mimeType: MimeType.IMAGE_JPEG,
                mediaType: MediaType.IMAGE,
                publicUrl: "/uploads/test.jpg",
                uploadedAt: new Date()
            }));

            const response = await request(app)
                .patch(`/api/v1/media/${saved.id}/reorder`)
                .send({ displayOrder: 10 });

            expect(response.status).toBe(200);
            expect(response.body.data.displayOrder).toBe(10);
        });
    });

    describe("DELETE /api/v1/media/:id", () => {
        it("should delete media", async () => {
            const repo = AppDataSource.getRepository(Media);
            const saved = await repo.save(repo.create({
                specialists: specialistId,
                fileName: "to-delete.jpg",
                fileSize: 1024,
                displayOrder: 1,
                mimeType: MimeType.IMAGE_JPEG,
                mediaType: MediaType.IMAGE,
                publicUrl: "/uploads/to-delete.jpg",
                uploadedAt: new Date()
            }));

            // Ensure physical file exists
            const filePath = path.join(process.cwd(), "uploads", "to-delete.jpg");
            if (!fs.existsSync(path.dirname(filePath))) {
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
            }
            fs.writeFileSync(filePath, "content");

            const response = await request(app).delete(`/api/v1/media/${saved.id}`);

            expect(response.status).toBe(204);

            const check = await repo.findOne({ where: { id: saved.id } });
            expect(check).toBeNull();
        });
    });
});
