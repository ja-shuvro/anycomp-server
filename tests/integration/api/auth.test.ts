import request from "supertest";
import { AppDataSource } from "../../../src/data-source";
import { app } from "../../../src/server";
import { User, UserRole } from "../../../src/entities/User.entity";

describe("Authentication API Integration", () => {
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
    });

    describe("POST /api/v1/auth/register", () => {
        it("should register a new user", async () => {
            const payload = {
                email: "test@example.com",
                password: "password123",
                role: UserRole.CLIENT
            };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(payload.email);
            expect(response.body.data.password).toBeUndefined();
        });

        it("should return 400 if email already exists", async () => {
            const payload = {
                email: "test@example.com",
                password: "password123"
            };

            await request(app).post("/api/v1/auth/register").send(payload);
            const response = await request(app).post("/api/v1/auth/register").send(payload);

            expect(response.status).toBe(400);
            expect(response.body.error.code).toBe("BAD_REQUEST");
        });
    });

    describe("POST /api/v1/auth/login", () => {
        it("should login and return a token", async () => {
            const payload = {
                email: "login@example.com",
                password: "password123"
            };

            await request(app).post("/api/v1/auth/register").send(payload);

            const response = await request(app)
                .post("/api/v1/auth/login")
                .send(payload);

            expect(response.status).toBe(200);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.email).toBe(payload.email);
        });

        it("should return 401 for invalid credentials", async () => {
            const payload = {
                email: "wrong@example.com",
                password: "password123"
            };

            const response = await request(app)
                .post("/api/v1/auth/login")
                .send(payload);

            expect(response.status).toBe(401);
        });
    });

    describe("GET /api/v1/auth/me", () => {
        it("should return current user info", async () => {
            const loginPayload = {
                email: "me@example.com",
                password: "password123"
            };

            await request(app).post("/api/v1/auth/register").send(loginPayload);
            const loginRes = await request(app).post("/api/v1/auth/login").send(loginPayload);
            const token = loginRes.body.data.token;

            const response = await request(app)
                .get("/api/v1/auth/me")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.email).toBe(loginPayload.email);
        });

        it("should return 401 without token", async () => {
            const response = await request(app).get("/api/v1/auth/me");
            expect(response.status).toBe(401);
        });
    });
});
