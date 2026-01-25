import swaggerJsdoc from "swagger-jsdoc";
import { Application } from "express";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Anycomp Specialist Management API",
            version: "1.0.0",
            description:
                "Production-grade RESTful API for the Anycomp Specialist Management Platform. Provides endpoints for managing specialists, service offerings, media, and platform fees.",
            contact: {
                name: "API Support",
                email: "support@anycomp.com",
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.APP_PORT || 3000}/api/v1`,
                description: "Development server",
            },
            {
                url: "https://api.anycomp.com/api/v1",
                description: "Production server",
            },
        ],
        components: {
            schemas: {
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true,
                        },
                        data: {
                            type: "object",
                        },
                        message: {
                            type: "string",
                        },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        error: {
                            type: "object",
                            properties: {
                                code: {
                                    type: "string",
                                },
                                message: {
                                    type: "string",
                                },
                                statusCode: {
                                    type: "number",
                                },
                                timestamp: {
                                    type: "string",
                                    format: "date-time",
                                },
                                path: {
                                    type: "string",
                                },
                            },
                        },
                    },
                },
                PaginationMeta: {
                    type: "object",
                    properties: {
                        currentPage: {
                            type: "number",
                            example: 1,
                        },
                        totalPages: {
                            type: "number",
                            example: 5,
                        },
                        totalItems: {
                            type: "number",
                            example: 48,
                        },
                        itemsPerPage: {
                            type: "number",
                            example: 10,
                        },
                        hasNextPage: {
                            type: "boolean",
                            example: true,
                        },
                        hasPrevPage: {
                            type: "boolean",
                            example: false,
                        },
                    },
                },
            },
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT Authorization header using Bearer scheme (for future auth)",
                },
            },
        },
        tags: [
            {
                name: "Health",
                description: "Health check endpoints",
            },
            {
                name: "Platform Fees",
                description: "Platform fee management endpoints",
            },
            {
                name: "Service Offerings",
                description: "Service offerings master list endpoints",
            },
            {
                name: "Specialists",
                description: "Specialist management endpoints",
            },
            {
                name: "Media",
                description: "Media upload and management endpoints",
            },
        ],
    },
    apis: [
        "./src/routes/*.ts",
        "./src/controllers/*.ts",
        "./src/swagger/paths/*.ts",
        "./src/swagger/schemas/*.ts"
    ],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Setup Swagger documentation
 */
export const setupSwagger = (app: Application): void => {
    // Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Swagger JSON
    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
};
