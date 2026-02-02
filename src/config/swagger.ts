import swaggerJsdoc from "swagger-jsdoc";
import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import path from "path";

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
                url: `https://${process.env.APP_DOMAIN || "anycomp-server.vercel.app"}/api/v1`,
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
                    description: "JWT Authorization header using Bearer scheme",
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
        path.resolve(__dirname, "../routes/*.ts"),
        path.resolve(__dirname, "../controllers/*.ts"),
        path.resolve(__dirname, "../swagger/paths/*.ts"),
        path.resolve(__dirname, "../swagger/schemas/*.ts"),
        // Include compiled js files as well
        path.resolve(__dirname, "../routes/*.js"),
        path.resolve(__dirname, "../controllers/*.js"),
        path.resolve(__dirname, "../swagger/paths/*.js"),
        path.resolve(__dirname, "../swagger/schemas/*.js"),
    ],
};

const swaggerSpec = swaggerJsdoc(options);

// Log if no paths are found to help debug Vercel deployment issues
const spec = swaggerSpec as any;
if (!spec.paths || Object.keys(spec.paths).length === 0) {
    console.warn("⚠️ Swagger Warning: No API paths were found. Check if your source files are included in the deployment.");
}

/**
 * Setup Swagger documentation
 */
export const setupSwagger = (app: Application): void => {
    // Swagger UI
    // Swagger UI setup with CDN assets for Vercel compatibility
    const CSS_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui.css";
    const JS_BUNDLE_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-bundle.js";
    const JS_PRESET_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js";
    const FAVICON_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/favicon-32x32.png";

    const swaggerOptions = {
        customCssUrl: CSS_URL,
        customJs: [JS_BUNDLE_URL, JS_PRESET_URL],
        customSiteTitle: "Anycomp API Docs",
        customfavIcon: FAVICON_URL,
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
        },
    };

    app.use("/api-docs", swaggerUi.serve);
    app.get("/api-docs", (req, res) => {
        const html = swaggerUi.generateHTML(swaggerSpec, swaggerOptions);

        // Explicitly replace default relative asset URLs with CDN URLs to prevent 404s on Vercel
        // Using a more robust regex to handle potential query strings or variations in quotes
        const fixedHtml = html
            .replace(/(href|src)=["']\.\/swagger-ui\.css[^"']*["']/g, `$1="${CSS_URL}"`)
            .replace(/(href|src)=["']\.\/swagger-ui-bundle\.js[^"']*["']/g, `$1="${JS_BUNDLE_URL}"`)
            .replace(/(href|src)=["']\.\/swagger-ui-standalone-preset\.js[^"']*["']/g, `$1="${JS_PRESET_URL}"`)
            .replace(/(href|src)=["']\.\/favicon-[^"']*["']/g, `$1="${FAVICON_URL}"`);

        res.send(fixedHtml);
    });

    // Swagger JSON
    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
};
