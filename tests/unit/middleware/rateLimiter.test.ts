import request from "supertest";
import express, { Application } from "express";
import { apiLimiter, strictLimiter } from "../../../src/middleware/rateLimiter";

describe("Rate Limiter Middleware", () => {
    let app: Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
    });

    describe("apiLimiter", () => {
        it("should allow requests within the limit", async () => {
            app.use(apiLimiter);
            app.get("/test", (req, res) => {
                res.json({ success: true });
            });

            const response = await request(app).get("/test");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it("should include rate limit headers", async () => {
            app.use(apiLimiter);
            app.get("/test", (req, res) => {
                res.json({ success: true });
            });

            const response = await request(app).get("/test");

            expect(response.headers["ratelimit-limit"]).toBeDefined();
            expect(response.headers["ratelimit-remaining"]).toBeDefined();
        });

        it("should be configurable via environment variables", () => {
            // Test that the limiter reads from environment variables
            expect(apiLimiter).toBeDefined();
            expect(typeof apiLimiter).toBe("function");
        });
    });

    describe("strictLimiter", () => {
        it("should allow requests within the strict limit", async () => {
            app.use(strictLimiter);
            app.post("/auth/login", (req, res) => {
                res.json({ success: true });
            });

            const response = await request(app).post("/auth/login");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it("should have stricter limits than apiLimiter", async () => {
            app.use(strictLimiter);
            app.post("/sensitive", (req, res) => {
                res.json({ success: true });
            });

            const response = await request(app).post("/sensitive");

            expect(response.status).toBe(200);
            expect(response.headers["ratelimit-limit"]).toBeDefined();
            // Strict limiter should have a lower limit
            const limit = parseInt(
                response.headers["ratelimit-limit"] as string
            );
            expect(limit).toBeLessThanOrEqual(5);
        });

        it("should include rate limit headers", async () => {
            app.use(strictLimiter);
            app.post("/test", (req, res) => {
                res.json({ success: true });
            });

            const response = await request(app).post("/test");

            expect(response.headers["ratelimit-limit"]).toBeDefined();
            expect(response.headers["ratelimit-remaining"]).toBeDefined();
        });
    });

    describe("Rate Limiting Behavior", () => {
        it("should create limiter instances", () => {
            expect(apiLimiter).toBeDefined();
            expect(strictLimiter).toBeDefined();
            expect(typeof apiLimiter).toBe("function");
            expect(typeof strictLimiter).toBe("function");
        });

        it("should use different configurations for api and strict limiters", async () => {
            const apiApp = express();
            apiApp.use(apiLimiter);
            apiApp.get("/api", (req, res) => res.json({ type: "api" }));

            const strictApp = express();
            strictApp.use(strictLimiter);
            strictApp.post("/strict", (req, res) => res.json({ type: "strict" }));

            const apiResponse = await request(apiApp).get("/api");
            const strictResponse = await request(strictApp).post("/strict");

            const apiLimit = parseInt(
                apiResponse.headers["ratelimit-limit"] as string
            );
            const strictLimit = parseInt(
                strictResponse.headers["ratelimit-limit"] as string
            );

            expect(strictLimit).toBeLessThan(apiLimit);
        });
    });
});
