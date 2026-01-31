import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveServiceIdFromServiceOfferingsMasterList1738313000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the unique index first
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_service_offerings_service_id"`);

        // Drop the service_id column
        await queryRunner.query(`ALTER TABLE "service_offerings_master_list" DROP COLUMN IF EXISTS "service_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add the service_id column back
        await queryRunner.query(`ALTER TABLE "service_offerings_master_list" ADD COLUMN "service_id" varchar(100)`);

        // Recreate the unique index
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_service_offerings_service_id" ON "service_offerings_master_list" ("service_id")`);
    }
}
