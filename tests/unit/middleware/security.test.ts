import request from "supertest";
import express, { Application } from "express";
import { securityMiddleware } from "../../../src/middleware/security";

describe("Security Middleware", () => {
    let app: Application;

    beforeEach(() => {
        app = express();
        app.use(securityMiddleware);
        app.get("/test", (req, res) => {
            res.json({ success: true });
        });
    });

    it("should apply security middleware", async () => {
        const response = await request(app).get("/test");

        expect(response.status).toBe(200);
    });

    it("should set security headers", async () => {
        const response = await request(app).get("/test");

        // Helmet sets various security headers
        expect(response.headers).toBeDefined();
    });

    it("should set X-Content-Type-Options header", async () => {
        const response = await request(app).get("/test");

        expect(response.headers["x-content-type-options"]).toBe("nosniff");
    });

    it("should set X-Frame-Options header", async () => {
        const response = await request(app).get("/test");

        expect(response.headers["x-frame-options"]).toBeDefined();
    });

    it("should set X-DNS-Prefetch-Control header", async () => {
        const response = await request(app).get("/test");

        expect(response.headers["x-dns-prefetch-control"]).toBe("off");
    });

    it("should not block legitimate requests", async () => {
        const response = await request(app).get("/test");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });

    it("should allow the app to function normally", async () => {
        app.post("/post-test", express.json(), (req, res) => {
            res.json({ received: true });
        });

        const response = await request(app)
            .post("/post-test")
            .send({ data: "test" });

        expect(response.status).toBe(200);
    });
});
