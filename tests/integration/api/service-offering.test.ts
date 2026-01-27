import request from "supertest";
import { ServiceOfferingsMasterList } from "../../../src/entities/ServiceOfferingsMasterList.entity";
import { ServiceOffering } from "../../../src/entities/ServiceOffering.entity";
import { AppDataSource } from "../../../src/data-source";
import { app } from "../../../src/server";
import { UserRole } from "../../../src/entities/User.entity";

describe("Service Offering API Integration", () => {
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

    let adminToken: string;

    beforeEach(async () => {
        // Clear dependent tables first
        await AppDataSource.query('DELETE FROM service_offerings');
        await AppDataSource.query('DELETE FROM service_offerings_master_list');
        await AppDataSource.query('DELETE FROM specialists');
        await AppDataSource.query('DELETE FROM users');

        // Setup admin for authenticated requests
        await request(app).post("/api/v1/auth/register").send({
            email: "admin_so@example.com", password: "password123", role: UserRole.ADMIN
        });
        const loginRes = await request(app).post("/api/v1/auth/login").send({
            email: "admin_so@example.com", password: "password123"
        });
        adminToken = loginRes.body.data.token;
    });

    describe("POST /api/v1/service-offerings", () => {
        it("should create a new service offering", async () => {
            const payload = {
                serviceId: "S-101",
                title: "Mock Interview",
                description: "Full mock interview session length description"
            };

            const response = await request(app)
                .post("/api/v1/service-offerings")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.serviceId).toBe("S-101");
        });
    });

    describe("GET /api/v1/service-offerings", () => {
        it("should return paginated services", async () => {
            const repo = AppDataSource.getRepository(ServiceOfferingsMasterList);
            await repo.save([
                repo.create({ serviceId: "S1", title: "T1", description: "Desc1 0123456789" }),
                repo.create({ serviceId: "S2", title: "T2", description: "Desc2 0123456789" })
            ]);

            const response = await request(app).get("/api/v1/service-offerings");

            expect(response.status).toBe(200);
            expect(response.body.data.items).toHaveLength(2);
        });
    });

    describe("GET /api/v1/service-offerings/:id", () => {
        it("should return a single service", async () => {
            const repo = AppDataSource.getRepository(ServiceOfferingsMasterList);
            const saved = await repo.save(repo.create({
                serviceId: "S1", title: "T1", description: "Desc1 0123456789"
            }));

            const response = await request(app).get(`/api/v1/service-offerings/${saved.id}`);

            expect(response.status).toBe(200);
            expect(response.body.data.serviceId).toBe("S1");
        });
    });

    describe("PATCH /api/v1/service-offerings/:id", () => {
        it("should update an existing service", async () => {
            const repo = AppDataSource.getRepository(ServiceOfferingsMasterList);
            const saved = await repo.save(repo.create({
                serviceId: "S1", title: "Old", description: "Desc1 0123456789"
            }));

            const response = await request(app)
                .patch(`/api/v1/service-offerings/${saved.id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ title: "New Title" });

            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe("New Title");
        });
    });

    describe("DELETE /api/v1/service-offerings/:id", () => {
        it("should delete a service", async () => {
            const repo = AppDataSource.getRepository(ServiceOfferingsMasterList);
            const saved = await repo.save(repo.create({
                serviceId: "S1", title: "T1", description: "Desc1 0123456789"
            }));

            const response = await request(app)
                .delete(`/api/v1/service-offerings/${saved.id}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(204);

            const check = await repo.findOne({ where: { id: saved.id } });
            expect(check).toBeNull();
        });
    });
});
