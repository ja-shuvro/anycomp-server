import "reflect-metadata";
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { securityMiddleware } from "./middleware/security";
import { apiLimiter } from "./middleware/rateLimiter";
import { requestLogger } from "./middleware/requestLogger";
import { setupSwagger } from "./config/swagger";
import logger from "./utils/logger";

// Load environment variables
dotenv.config();

import { validateEnv } from "./utils/env-validator";
validateEnv();

const app: Application = express();
export const PORT = process.env.APP_PORT || 3000;
export { app };

// Security middleware (must be first)
app.use(securityMiddleware);

// CORS configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Rate limiting middleware
app.use("/api", apiLimiter);

// API Documentation
setupSwagger(app);

// Static file serving for uploads
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Anycomp Specialist Management API",
        version: "1.0.0",
        documentation: `http://localhost:${PORT}/api-docs`,
    });
});

// Global error handler (must be last)
app.use(errorHandler);

// Initialize database and start server
let server: any;

const startServer = async () => {
    try {
        // Initialize TypeORM connection
        await AppDataSource.initialize();
        logger.info("✅ Database connection established successfully");

        // Start Express server and store the instance
        server = app.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT}`);
            logger.info(`📍 API available at http://localhost:${PORT}/api/v1`);
            logger.info(`📚 API Documentation at http://localhost:${PORT}/api-docs`);
            logger.info(`🏥 Health check at http://localhost:${PORT}/api/v1/health`);
            logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
        });
    } catch (error) {
        logger.error("❌ Error during server initialization:", error);
        process.exit(1);
    }
};

// Graceful shutdown function
const gracefulShutdown = async (signal: string) => {
    logger.info(`\n🛑 ${signal} received, shutting down gracefully...`);

    // Close HTTP server first to stop accepting new connections
    if (server) {
        server.close(() => {
            logger.info("🛑 HTTP server closed");
        });
    }

    // Close database connection
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        logger.info("🛑 Database connection closed");
    }

    process.exit(0);
};

// Handle different shutdown signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // For nodemon

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
    logger.error("❌ Uncaught Exception:", error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
    logger.error("❌ Unhandled Rejection:", reason);
    process.exit(1);
});

// Start the server if not in test environment
if (process.env.NODE_ENV !== "test") {
    startServer();
}
