import { PlatformFeeService } from "../../../src/services/platform-fee.service";
import { AppDataSource } from "../../../src/data-source";

jest.mock("../../../src/data-source");

describe("PlatformFeeService", () => {
    let service: PlatformFeeService;
    let mockRepository: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create a persistent query builder mock
        const queryBuilderMock = {
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getOne: jest.fn(),
            getManyAndCount: jest.fn()
        };

        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn().mockResolvedValue([[], 0]),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => queryBuilderMock)
        };

        (AppDataSource.getRepository as jest.Mock) = jest.fn().mockReturnValue(mockRepository);
        service = new PlatformFeeService();
    });

    describe("create", () => {
        it("should create a platform fee tier", async () => {
            const mockFee = {
                id: "test-id",
                tierName: "Basic",
                minValue: 0,
                maxValue: 5000,
                platformFeePercentage: 5.0
            };

            mockRepository.create.mockReturnValue(mockFee);
            mockRepository.save.mockResolvedValue(mockFee);
            mockRepository.createQueryBuilder().getOne.mockResolvedValue(null);

            const result = await service.create({
                tierName: "basic" as any,
                minValue: 0,
                maxValue: 5000,
                platformFeePercentage: 5.0
            });

            expect(result).toEqual(mockFee);
        });
    });

    describe("calculateFee", () => {
        it("should calculate fee for single tier", async () => {
            const mockTier = { tierName: "Basic", minValue: 0, maxValue: 10000, platformFeePercentage: 5.0 };

            mockRepository.createQueryBuilder().getOne.mockResolvedValue(mockTier);

            const result = await service.calculateFee(5000);

            expect(result.fee).toBe(250); // 5% of 5000
            expect(result.tierName).toBe("Basic");
        });

        it("should calculate fee using the matched tier percentage", async () => {
            const mockTier = { tierName: "Standard", minValue: 5001, maxValue: 10000, platformFeePercentage: 7.0 };

            mockRepository.createQueryBuilder().getOne.mockResolvedValue(mockTier);

            const result = await service.calculateFee(8000);

            // 8000 * 0.07 = 560
            expect(result.fee).toBe(560);
            expect(result.tierName).toBe("Standard");
        });

        it("should fall back to highest tier when no range matches", async () => {
            const highestTier = { tierName: "Enterprise", minValue: 50000, maxValue: 100000, platformFeePercentage: 10.0 };

            mockRepository.createQueryBuilder().getOne.mockResolvedValue(null);
            mockRepository.findAndCount.mockResolvedValue([[highestTier], 1]);

            const result = await service.calculateFee(200000);

            // 200000 * 0.10 = 20000
            expect(result.fee).toBe(20000);
            expect(result.tierName).toBe("Enterprise");
        });
    });

    describe("findAll", () => {
        it("should return paginated results", async () => {
            const mockFees = [
                { id: "1", tierName: "Basic" },
                { id: "2", tierName: "Premium" }
            ];

            mockRepository.findAndCount.mockResolvedValue([mockFees, 2]);

            const result = await service.findAll(1, 10);

            expect(result.items).toEqual(mockFees);
            expect(result.total).toBe(2);
        });
    });

    describe("delete", () => {
        it("should delete a platform fee", async () => {
            mockRepository.delete.mockResolvedValue({ affected: 1 });

            await service.delete("test-id");

            expect(mockRepository.delete).toHaveBeenCalledWith("test-id");
        });

        it("should throw error when fee not found", async () => {
            mockRepository.delete.mockResolvedValue({ affected: 0 });

            await expect(service.delete("non-existent")).rejects.toThrow(/not found/i);
        });
    });
});
