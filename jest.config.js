module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/?(*.)+(spec|test).ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/migrations/**',
        '!src/seeds/**',
        '!src/server.ts',
        '!src/data-source.ts',
        '!src/test-utils/**'
    ],
    coverageDirectory: 'coverage',
    verbose: true,
    testTimeout: 10000,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
};
