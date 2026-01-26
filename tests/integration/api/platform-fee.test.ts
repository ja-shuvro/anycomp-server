import request from "supertest";
import { PlatformFee, TierName } from "../../../src/entities/PlatformFee.entity";
import { AppDataSource } from "../../../src/data-source";
import { app } from "../../../src/server";

describe("Platform Fee API Integration", () => {
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
        const repo = AppDataSource.getRepository(PlatformFee);
        await repo.clear();
    });

    describe("POST /api/v1/platform-fees", () => {
        it("should create a new platform fee tier", async () => {
            const payload = {
                tierName: TierName.BASIC,
                minValue: 0,
                maxValue: 1000,
                platformFeePercentage: 5.0
            };

            const response = await request(app)
                .post("/api/v1/platform-fees")
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body.data.tierName).toBe(TierName.BASIC);
        });
    });

    describe("GET /api/v1/platform-fees", () => {
        it("should return paginated tiers", async () => {
            const repo = AppDataSource.getRepository(PlatformFee);
            await repo.save([
                repo.create({ tierName: TierName.BASIC, minValue: 0, maxValue: 100, platformFeePercentage: 1 }),
                repo.create({ tierName: TierName.STANDARD, minValue: 101, maxValue: 200, platformFeePercentage: 2 })
            ]);

            const response = await request(app).get("/api/v1/platform-fees");

            expect(response.status).toBe(200);
            expect(response.body.data.items).toHaveLength(2);
        });
    });

    describe("GET /api/v1/platform-fees/:id", () => {
        it("should return a single tier", async () => {
            const repo = AppDataSource.getRepository(PlatformFee);
            const saved = await repo.save(repo.create({
                tierName: TierName.BASIC, minValue: 0, maxValue: 100, platformFeePercentage: 1
            }));

            const response = await request(app).get(`/api/v1/platform-fees/${saved.id}`);

            expect(response.status).toBe(200);
            expect(response.body.data.tierName).toBe(TierName.BASIC);
        });
    });

    describe("PATCH /api/v1/platform-fees/:id", () => {
        it("should update an existing tier", async () => {
            const repo = AppDataSource.getRepository(PlatformFee);
            const saved = await repo.save(repo.create({
                tierName: TierName.BASIC, minValue: 0, maxValue: 100, platformFeePercentage: 1
            }));

            const response = await request(app)
                .patch(`/api/v1/platform-fees/${saved.id}`)
                .send({ tierName: TierName.STANDARD });

            expect(response.status).toBe(200);
            expect(response.body.data.tierName).toBe(TierName.STANDARD);
        });
    });

    describe("DELETE /api/v1/platform-fees/:id", () => {
        it("should delete a tier", async () => {
            const repo = AppDataSource.getRepository(PlatformFee);
            const saved = await repo.save(repo.create({
                tierName: TierName.BASIC, minValue: 0, maxValue: 100, platformFeePercentage: 1
            }));

            const response = await request(app).delete(`/api/v1/platform-fees/${saved.id}`);

            expect(response.status).toBe(204);

            const check = await repo.findOne({ where: { id: saved.id } });
            expect(check).toBeNull();
        });
    });
});
