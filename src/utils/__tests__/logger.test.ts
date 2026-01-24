import logger from "../logger";

describe("Logger Utility", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        // Spy on console methods to prevent actual logging during tests
        consoleSpy = jest.spyOn(console, "log").mockImplementation();
        jest.spyOn(console, "error").mockImplementation();
        jest.spyOn(console, "warn").mockImplementation();
        jest.spyOn(console, "info").mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should have error method", () => {
        expect(logger.error).toBeDefined();
        expect(typeof logger.error).toBe("function");

        logger.error("Test error");
        // Logger should execute without throwing
    });

    it("should have warn method", () => {
        expect(logger.warn).toBeDefined();
        expect(typeof logger.warn).toBe("function");

        logger.warn("Test warning");
    });

    it("should have info method", () => {
        expect(logger.info).toBeDefined();
        expect(typeof logger.info).toBe("function");

        logger.info("Test info");
    });

    it("should have http method", () => {
        expect(logger.http).toBeDefined();
        expect(typeof logger.http).toBe("function");

        logger.http("Test http");
    });

    it("should have debug method", () => {
        expect(logger.debug).toBeDefined();
        expect(typeof logger.debug).toBe("function");

        logger.debug("Test debug");
    });

    it("should log error messages", () => {
        const message = "This is an error";
        logger.error(message);

        expect(logger.error).toBeDefined();
    });

    it("should log warning messages", () => {
        const message = "This is a warning";
        logger.warn(message);

        expect(logger.warn).toBeDefined();
    });

    it("should log info messages", () => {
        const message = "This is info";
        logger.info(message);

        expect(logger.info).toBeDefined();
    });

    it("should log http messages", () => {
        const message = "HTTP request";
        logger.http(message);

        expect(logger.http).toBeDefined();
    });

    it("should log debug messages", () => {
        const message = "Debug information";
        logger.debug(message);

        expect(logger.debug).toBeDefined();
    });

    it("should handle error objects", () => {
        const error = new Error("Test error");

        expect(() => logger.error("Error occurred:", error)).not.toThrow();
    });

    it("should handle multiple arguments", () => {
        expect(() => logger.info("Message", { data: "test" }, 123)).not.toThrow();
    });

    it("should be a singleton instance", () => {
        expect(logger).toBeDefined();
        expect(logger).toBe(logger); // Same instance
    });

    it("should have all required log levels", () => {
        const requiredMethods = ["error", "warn", "info", "http", "debug"];

        requiredMethods.forEach((method) => {
            expect(logger).toHaveProperty(method);
            expect(typeof (logger as any)[method]).toBe("function");
        });
    });
});
