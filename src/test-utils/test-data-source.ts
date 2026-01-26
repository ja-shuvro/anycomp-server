import { DataSource } from "typeorm";

export const TestDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_NAME_TEST || "anycomp_test",
    synchronize: true, // Auto-sync schema for tests
    dropSchema: true,  // Drop schema before each test run
    entities: ["src/entities/**/*.ts"],
    logging: false
});
