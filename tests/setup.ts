import "reflect-metadata";
import dotenv from "dotenv";

// Load default env
dotenv.config();

// Override for testing
process.env.NODE_ENV = "test";
process.env.DB_NAME = process.env.DB_NAME_TEST || "anycomp_test";
process.env.DB_USER = process.env.DB_USER || "postgres";
process.env.DB_PASS = process.env.DB_PASS || "postgres";
process.env.LOGGING = "false";
