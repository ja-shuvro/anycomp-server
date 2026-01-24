import request from "supertest";
import express, { Application } from "express";
import healthRoutes from "../healthRoutes";

describe("Health Routes", () => {
    let app: Application;

    beforeAll(() => {
        // Setup a test Express app
        app = express();
        app.use(express.json());
        app.use("/api/v1", healthRoutes);
    });

    describe("GET /api/v1/health", () => {
        it("should return 200 and health status", async () => {
            const response = await request(app).get("/api/v1/health");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("status");
            expect(response.body.data).toHaveProperty("timestamp");
            expect(response.body.data).toHaveProperty("uptime");
            expect(response.body.data).toHaveProperty("database");
        });

        it("should have correct response structure", async () => {
            const response = await request(app).get("/api/v1/health");

            expect(response.body).toMatchObject({
                success: true,
                data: {
                    status: expect.any(String),
                    timestamp: expect.any(String),
                    uptime: expect.any(Number),
                    database: expect.any(String),
                },
            });
        });

        it("should return status as ok", async () => {
            const response = await request(app).get("/api/v1/health");

            expect(response.body.data.status).toBe("ok");
        });

        it("should return valid timestamp", async () => {
            const response = await request(app).get("/api/v1/health");

            const timestamp = new Date(response.body.data.timestamp);
            expect(timestamp.toString()).not.toBe("Invalid Date");
        });

        it("should return database status", async () => {
            const response = await request(app).get("/api/v1/health");

            expect(["connected", "disconnected"]).toContain(
                response.body.data.database
            );
        });
    });
});
