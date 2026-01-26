import { PlatformFeeService } from "../../../src/services/platform-fee.service";
import { AppDataSource } from "../../../src/data-source";

jest.mock("../../../src/data-source");

describe("PlatformFeeService", () => {
    let service: PlatformFeeService;
    let mockRepository: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn()
            }))
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

            const result = await service.create({
                tierName: "basic" as any,
                minValue: 0,
                maxValue: 5000,
                platformFeePercentage: 5.0
            });

            expect(result).toEqual(mockFee);
            expect(mockRepository.create).toHaveBeenCalled();
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe("calculateFee", () => {
        it("should calculate fee for single tier", async () => {
            const mockTiers = [
                { minValue: 0, maxValue: 10000, platformFeePercentage: 5.0 }
            ];

            mockRepository.find.mockResolvedValue(mockTiers);

            const result = await service.calculateFee(5000);

            expect(result.fee).toBe(250); // 5% of 5000
        });

        it("should calculate fee across multiple tiers", async () => {
            const mockTiers = [
                { minValue: 0, maxValue: 5000, platformFeePercentage: 5.0 },
                { minValue: 5001, maxValue: 10000, platformFeePercentage: 7.0 }
            ];

            mockRepository.find.mockResolvedValue(mockTiers);

            const result = await service.calculateFee(8000);

            // First tier: 5000 * 0.05 = 250
            // Second tier: 3000 * 0.07 = 210
            // Total: 460
            expect(result.fee).toBe(460);
        });

        it("should return 0 for amount of 0", async () => {
            mockRepository.find.mockResolvedValue([]);

            const result = await service.calculateFee(0);

            expect(result.fee).toBe(0);
        });
    });

    describe("findAll", () => {
        it("should return paginated results", async () => {
            const mockFees = [
                { id: "1", tierName: "Basic" },
                { id: "2", tierName: "Premium" }
            ];

            mockRepository.createQueryBuilder().getManyAndCount.mockResolvedValue([mockFees, 2]);

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
