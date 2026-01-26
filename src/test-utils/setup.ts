import { TestDataSource } from "./test-data-source";

beforeAll(async () => {
    await TestDataSource.initialize();
});

afterAll(async () => {
    await TestDataSource.destroy();
});

afterEach(async () => {
    // Clean up all tables after each test
    const entities = TestDataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = TestDataSource.getRepository(entity.name);
        await repository.query(`TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`);
    }
});
