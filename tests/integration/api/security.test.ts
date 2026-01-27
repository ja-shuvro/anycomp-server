import request from "supertest";
import { AppDataSource } from "../../../src/data-source";
import { app } from "../../../src/server";
import { User, UserRole } from "../../../src/entities/User.entity";
import { Specialist } from "../../../src/entities/Specialist.entity";
import { Media, MimeType, MediaType } from "../../../src/entities/Media.entity";

describe("Security Integration Tests (RBAC & Ownership)", () => {
    let adminToken: string;
    let userAToken: string;
    let userBToken: string;
    let userAId: string;
    let userBId: string;
    let specialistAId: string;
    let specialistBId: string;
    let mediaAId: string;

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    });

    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });

    beforeEach(async () => {
        await AppDataSource.query('DELETE FROM service_offerings');
        await AppDataSource.query('DELETE FROM media');
        await AppDataSource.query('DELETE FROM specialists');
        await AppDataSource.query('DELETE FROM users');

        // 1. Create Users
        const registerAdmin = await request(app).post("/api/v1/auth/register").send({
            email: "admin@example.com", password: "password123", role: UserRole.ADMIN
        });
        const registerUserA = await request(app).post("/api/v1/auth/register").send({
            email: "usera@example.com", password: "password123", role: UserRole.SPECIALIST
        });
        const registerUserB = await request(app).post("/api/v1/auth/register").send({
            email: "userb@example.com", password: "password123", role: UserRole.SPECIALIST
        });

        userAId = registerUserA.body.data.id;
        userBId = registerUserB.body.data.id;

        // 2. Logins
        const loginAdmin = await request(app).post("/api/v1/auth/login").send({
            email: "admin@example.com", password: "password123"
        });
        const loginUserA = await request(app).post("/api/v1/auth/login").send({
            email: "usera@example.com", password: "password123"
        });
        const loginUserB = await request(app).post("/api/v1/auth/login").send({
            email: "userb@example.com", password: "password123"
        });

        adminToken = loginAdmin.body.data.token;
        userAToken = loginUserA.body.data.token;
        userBToken = loginUserB.body.data.token;

        // 3. Create Specialists
        const specialistRepo = AppDataSource.getRepository(Specialist);
        const specA = await specialistRepo.save(specialistRepo.create({
            title: "Specialist A", description: "Bio for A 1234567890",
            basePrice: 100, isDraft: true, durationDays: 1,
            platformFee: 5, slug: "spec-a", userId: userAId
        }));
        specialistAId = specA.id;

        const specB = await specialistRepo.save(specialistRepo.create({
            title: "Specialist B", description: "Bio for B 1234567890",
            basePrice: 200, isDraft: true, durationDays: 2,
            platformFee: 10, slug: "spec-b", userId: userBId
        }));
        specialistBId = specB.id;

        // 4. Create Media for Specialist A
        const mediaRepo = AppDataSource.getRepository(Media);
        const mediaA = await mediaRepo.save(mediaRepo.create({
            specialists: specialistAId,
            fileName: "test.jpg",
            fileSize: 1024,
            displayOrder: 1,
            mimeType: MimeType.IMAGE_JPEG,
            mediaType: MediaType.IMAGE,
            publicUrl: "/uploads/test.jpg",
            uploadedAt: new Date()
        }));
        mediaAId = mediaA.id;
    });

    describe("RBAC Checks", () => {
        it("should prevent CLIENT role from creating specialists", async () => {
            const clientReg = await request(app).post("/api/v1/auth/register").send({
                email: "client@example.com", password: "password123", role: UserRole.CLIENT
            });
            const clientLogin = await request(app).post("/api/v1/auth/login").send({
                email: "client@example.com", password: "password123"
            });
            const clientToken = clientLogin.body.data.token;

            const response = await request(app)
                .post("/api/v1/specialists")
                .set("Authorization", `Bearer ${clientToken}`)
                .send({
                    title: "Client Post", description: "Should fail 1234567890",
                    basePrice: 100, durationDays: 1
                });

            expect(response.status).toBe(403);
            expect(response.body.error.code).toBe("FORBIDDEN");
        });

        it("should allow SPECIALIST role to create specialists", async () => {
            const response = await request(app)
                .post("/api/v1/specialists")
                .set("Authorization", `Bearer ${userAToken}`)
                .send({
                    title: "New Specialist", description: "Should work 1234567890",
                    basePrice: 300, durationDays: 3
                });

            expect(response.status).toBe(201);
            expect(response.body.data.userId).toBe(userAId);
        });
    });

    describe("Ownership Checks - Specialist", () => {
        it("should prevent User A from updating User B's specialist", async () => {
            const response = await request(app)
                .patch(`/api/v1/specialists/${specialistBId}`)
                .set("Authorization", `Bearer ${userAToken}`)
                .send({ title: "Hacked Title" });

            expect(response.status).toBe(403);
        });

        it("should allow User A to update their own specialist", async () => {
            const response = await request(app)
                .patch(`/api/v1/specialists/${specialistAId}`)
                .set("Authorization", `Bearer ${userAToken}`)
                .send({ title: "My Own Title" });

            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe("My Own Title");
        });

        it("should allow ADMIN to update anyone's specialist", async () => {
            const response = await request(app)
                .patch(`/api/v1/specialists/${specialistAId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ title: "Admin Modified" });

            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe("Admin Modified");
        });

        it("should prevent User A from deleting User B's specialist", async () => {
            const response = await request(app)
                .delete(`/api/v1/specialists/${specialistBId}`)
                .set("Authorization", `Bearer ${userAToken}`);

            expect(response.status).toBe(403);
        });
    });

    describe("Ownership Checks - Media", () => {
        it("should prevent User B from deleting User A's media", async () => {
            const response = await request(app)
                .delete(`/api/v1/media/${mediaAId}`)
                .set("Authorization", `Bearer ${userBToken}`);

            expect(response.status).toBe(403);
        });

        it("should allow User A to delete their own media", async () => {
            const response = await request(app)
                .delete(`/api/v1/media/${mediaAId}`)
                .set("Authorization", `Bearer ${userAToken}`);

            expect(response.status).toBe(204);
        });

        it("should allow ADMIN to delete any media", async () => {
            const response = await request(app)
                .delete(`/api/v1/media/${mediaAId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(204);
        });
    });
});
