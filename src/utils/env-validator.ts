import dotenv from "dotenv";

dotenv.config();

/**
 * Validates that all required environment variables are present.
 * Throws an error if any are missing.
 */
export const validateEnv = (): void => {
    const requiredEnvVars = [
        "DB_HOST",
        "DB_PORT",
        "DB_USER",
        "DB_PASS",
        "DB_NAME"
    ];

    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingVars.length > 0) {
        const errorMsg = `Error: Missing required environment variables: ${missingVars.join(", ")}`;
        console.error(errorMsg);
        process.exit(1);
    }

    // Optional but recommended: Validate numeric values
    if (process.env.APP_PORT && isNaN(Number(process.env.APP_PORT))) {
        console.error("Error: APP_PORT must be a number");
        process.exit(1);
    }

    if (process.env.DB_PORT && isNaN(Number(process.env.DB_PORT))) {
        console.error("Error: DB_PORT must be a number");
        process.exit(1);
    }

    if (process.env.NODE_ENV === "production" && (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === "*")) {
        console.warn("⚠️  Warning: CORS_ORIGIN is set to '*' or missing in production. This is a security risk.");
    }

    console.log("✅ Environment variable validation successful");
};
