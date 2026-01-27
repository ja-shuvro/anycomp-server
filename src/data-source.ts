import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Specialist } from "./entities/Specialist.entity";
import { PlatformFee } from "./entities/PlatformFee.entity";
import { ServiceOfferingsMasterList } from "./entities/ServiceOfferingsMasterList.entity";
import { ServiceOffering } from "./entities/ServiceOffering.entity";
import { Media } from "./entities/Media.entity";
import { User } from "./entities/User.entity";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "anycomp_db",
    synchronize: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test",
    logging: process.env.LOGGING === "true",
    entities: [Specialist, PlatformFee, ServiceOfferingsMasterList, ServiceOffering, Media, User],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
    // SSL configuration for cloud databases (Supabase, AWS RDS, etc.)
    ssl:
        process.env.DB_SSL === "true"
            ? {
                rejectUnauthorized: false,
            }
            : false,
});
