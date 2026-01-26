import request from "supertest";
import express from "express";
import healthRoutes from "../../../src/routes/health.routes";

const app = express();
app.use("/api/v1", healthRoutes);

describe("Health API Integration Tests", () => {
    describe("GET /api/v1/health", () => {
        it("should return 200 status", async () => {
            const response = await request(app).get("/api/v1/health");

            expect(response.status).toBe(200);
        });

        it("should return success: true", async () => {
            const response = await request(app).get("/api/v1/health");

            expect(response.body.success).toBe(true);
        });

        it("should include all required fields", async () => {
            const response = await request(app).get("/api/v1/health");

            expect(response.body.data).toHaveProperty("status");
            expect(response.body.data).toHaveProperty("timestamp");
            expect(response.body.data).toHaveProperty("uptime");
            expect(response.body.data).toHaveProperty("database");
        });

        it("should return database status", async () => {
            const response = await request(app).get("/api/v1/health");

            expect(response.body.data.database).toMatch(/connected|disconnected/);
        });
    });
});
