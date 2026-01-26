import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function createTestDb() {
    const client = new Client({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASS || "postgres",
        database: "postgres"
    });

    try {
        await client.connect();
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'anycomp_test'");
        if (res.rowCount === 0) {
            await client.query("CREATE DATABASE anycomp_test");
            console.log("Database anycomp_test created successfully");
        } else {
            console.log("Database anycomp_test already exists");
        }
    } catch (err) {
        console.error("Error creating database:", err);
    } finally {
        await client.end();
    }
}

createTestDb();
