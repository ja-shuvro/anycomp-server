import request from "supertest";
import { Specialist, VerificationStatus } from "../../../src/entities/Specialist.entity";
import { PlatformFee, TierName } from "../../../src/entities/PlatformFee.entity";
import { AppDataSource } from "../../../src/data-source";
import { app } from "../../../src/server";
import { User, UserRole } from "../../../src/entities/User.entity";

describe("Specialist API Integration", () => {
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

    let authToken: string;
    let userId: string;

    beforeEach(async () => {
        await AppDataSource.query('DELETE FROM service_offerings');
        await AppDataSource.query('DELETE FROM media');
        await AppDataSource.query('DELETE FROM specialists');
        await AppDataSource.query('DELETE FROM platform_fee');
        await AppDataSource.query('DELETE FROM users');

        // Setup user for authenticated requests
        const regRes = await request(app).post("/api/v1/auth/register").send({
            email: "specialist@example.com", password: "password123", role: UserRole.SPECIALIST
        });
        userId = regRes.body.data.id;

        const loginRes = await request(app).post("/api/v1/auth/login").send({
            email: "specialist@example.com", password: "password123"
        });
        authToken = loginRes.body.data.token;

        const pfRepo = AppDataSource.getRepository(PlatformFee);
        await pfRepo.save(pfRepo.create({
            tierName: TierName.BASIC,
            minValue: 0,
            maxValue: 1000,
            platformFeePercentage: 5.0
        }));
    });

    describe("POST /api/v1/specialists", () => {
        it("should create a new specialist in draft status", async () => {
            const payload = {
                title: "Software Engineer",
                description: "Expert software engineer with 10 years experience",
                basePrice: 500,
                durationDays: 5
            };

            const response = await request(app)
                .post("/api/v1/specialists")
                .set("Authorization", `Bearer ${authToken}`)
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body.data.title).toBe("Software Engineer");
            expect(response.body.data.isDraft).toBe(true);
            expect(Number(response.body.data.platformFee)).toBe(25);
        });
    });

    describe("GET /api/v1/specialists", () => {
        it("should return paginated specialists", async () => {
            const repo = AppDataSource.getRepository(Specialist);
            const s1 = repo.create({
                title: "T1", description: "Bio 1 0123456789",
                basePrice: 100, isDraft: false, durationDays: 1,
                platformFee: 5, slug: "t1-slug"
            });
            const s2 = repo.create({
                title: "T2", description: "Bio 2 0123456789",
                basePrice: 200, isDraft: false, durationDays: 2,
                platformFee: 10, slug: "t2-slug"
            });
            await repo.save([s1, s2]);

            const response = await request(app).get("/api/v1/specialists");

            expect(response.status).toBe(200);
            expect(response.body.data.items).toHaveLength(2);
        });
    });

    describe("GET /api/v1/specialists/:id", () => {
        it("should return a single specialist", async () => {
            const repo = AppDataSource.getRepository(Specialist);
            const saved = await repo.save(repo.create({
                title: "T1", description: "Bio 1 0123456789",
                basePrice: 100, isDraft: true, durationDays: 1,
                platformFee: 5, slug: "t1-slug"
            }));

            const response = await request(app).get(`/api/v1/specialists/${saved.id}`);

            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe("T1");
        });
    });

    describe("PATCH /api/v1/specialists/:id", () => {
        it("should update specialist details", async () => {
            const repo = AppDataSource.getRepository(Specialist);
            const saved = await repo.save(repo.create({
                title: "Old", description: "Bio 1 0123456789",
                basePrice: 100, isDraft: true, durationDays: 1,
                platformFee: 5, slug: "old-slug", userId: userId
            }));

            const response = await request(app)
                .patch(`/api/v1/specialists/${saved.id}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({ title: "New Title" });

            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe("New Title");
        });
    });

    describe("DELETE /api/v1/specialists/:id", () => {
        it("should soft delete a specialist", async () => {
            const repo = AppDataSource.getRepository(Specialist);
            const saved = await repo.save(repo.create({
                title: "T1", description: "Bio 1 0123456789",
                basePrice: 100, isDraft: true, durationDays: 1,
                platformFee: 5, slug: "t1-slug", userId: userId
            }));

            const response = await request(app)
                .delete(`/api/v1/specialists/${saved.id}`)
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.status).toBe(204);

            const check = await repo.findOne({ where: { id: saved.id } });
            expect(check).toBeNull();
        });
    });
});
