import { DataSource } from "typeorm";
import { Specialist } from "../entities/Specialist.entity";
import { PlatformFee } from "../entities/PlatformFee.entity";
import { ServiceOfferingsMasterList } from "../entities/ServiceOfferingsMasterList.entity";
import { ServiceOffering } from "../entities/ServiceOffering.entity";
import { Media } from "../entities/Media.entity";
import dotenv from "dotenv";

dotenv.config();

export const TestDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME_TEST || "anycomp_test",
    synchronize: true, // Auto-sync schema for tests
    dropSchema: true,  // Drop schema before each test run
    entities: [Specialist, PlatformFee, ServiceOfferingsMasterList, ServiceOffering, Media],
    logging: false
});
