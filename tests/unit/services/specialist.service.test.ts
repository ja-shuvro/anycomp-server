import { SpecialistService } from "../../../src/services/specialist.service";
import { PlatformFeeService } from "../../../src/services/platform-fee.service";
import { AppDataSource } from "../../../src/data-source";
import { Specialist } from "../../../src/entities/Specialist.entity";

// Mock dependencies
jest.mock("../../../src/data-source");
jest.mock("../../../src/services/platform-fee.service");

describe("SpecialistService", () => {
    let service: SpecialistService;
    let mockRepository: any;
    let mockServiceOfferingRepo: any;
    let mockPlatformFeeService: jest.Mocked<PlatformFeeService>;
    let mockQueryRunner: any;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock ServiceOffering repository
        mockServiceOfferingRepo = {
            create: jest.fn((data) => data),
            save: jest.fn((data) => Promise.resolve(data))
        };

        // Create a persistent query builder mock
        const queryBuilderMock = {
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getOne: jest.fn(),
            getManyAndCount: jest.fn()
        };

        // Mock repository
        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => queryBuilderMock),
            softDelete: jest.fn()
        };

        // Mock QueryRunner
        mockQueryRunner = {
            connect: jest.fn().mockResolvedValue(undefined),
            startTransaction: jest.fn().mockResolvedValue(undefined),
            commitTransaction: jest.fn().mockResolvedValue(undefined),
            rollbackTransaction: jest.fn().mockResolvedValue(undefined),
            release: jest.fn().mockResolvedValue(undefined),
            manager: {
                getRepository: jest.fn((entity) => {
                    if (entity.name === 'ServiceOffering') {
                        return mockServiceOfferingRepo;
                    }
                    return mockRepository;
                }),
                save: jest.fn((entity) => Promise.resolve(entity))
            }
        };

        // Mock AppDataSource
        (AppDataSource.getRepository as jest.Mock) = jest.fn().mockReturnValue(mockRepository);
        (AppDataSource.createQueryRunner as jest.Mock) = jest.fn().mockReturnValue(mockQueryRunner);

        // Mock PlatformFeeService
        mockPlatformFeeService = {
            calculateFee: jest.fn().mockResolvedValue({ fee: 500, finalAmount: 5500 })
        } as any;

        service = new SpecialistService();
        (service as any).platformFeeService = mockPlatformFeeService;
    });

    describe("create", () => {
        it("should create a specialist with calculated platform fee", async () => {
            const mockSpecialist = {
                id: "test-id",
                title: "Test Specialist",
                slug: "test-specialist",
                basePrice: 5000,
                platformFee: 500,
                finalPrice: 5500,
                isDraft: true,
                verificationStatus: "pending"
            };

            mockRepository.create.mockReturnValue(mockSpecialist);
            mockQueryRunner.manager.save.mockResolvedValue(mockSpecialist);
            mockRepository.findOne.mockResolvedValue(mockSpecialist);
            mockRepository.createQueryBuilder().getOne.mockResolvedValue(null);

            const dto = {
                title: "Test Specialist",
                description: "Test description",
                basePrice: 5000,
                durationDays: 7
            };

            const result = await service.create(dto);

            expect(result).toBeDefined();
            expect(mockPlatformFeeService.calculateFee).toHaveBeenCalledWith(5000);
            expect(mockRepository.create).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        });

        it("should generate slug from title", async () => {
            const createSpy = jest.spyOn(service as any, "generateSlug");

            const mockSpecialist = {
                id: "test-id",
                title: "My Awesome Specialist",
                slug: "my-awesome-specialist"
            };

            mockRepository.create.mockReturnValue(mockSpecialist);
            mockQueryRunner.manager.save.mockResolvedValue(mockSpecialist);
            mockRepository.findOne.mockResolvedValue(mockSpecialist);
            mockRepository.createQueryBuilder().getOne.mockResolvedValue(null);

            await service.create({
                title: "My Awesome Specialist",
                description: "Test",
                basePrice: 1000,
                durationDays: 5
            });

            expect(createSpy).toHaveBeenCalled();
        });
    });

    describe("publish", () => {
        it("should publish a draft specialist with services", async () => {
            const mockSpecialist = {
                id: "test-id",
                title: "Test",
                isDraft: true,
                verificationStatus: "pending",
                basePrice: 5000,
                durationDays: 7,
                description: "Test",
                serviceOfferings: [{ id: "service-1" }]
            };

            mockRepository.findOne.mockResolvedValue(mockSpecialist);
            mockRepository.save.mockResolvedValue({ ...mockSpecialist, isDraft: false });

            const result = await service.publish("test-id");

            expect(result.isDraft).toBe(false);
        });

        it("should throw error when publishing specialist without services", async () => {
            const mockSpecialist = {
                id: "test-id",
                title: "Test",
                description: "Test description",
                basePrice: 5000,
                durationDays: 7,
                isDraft: true,
                verificationStatus: "pending",
                serviceOfferings: []
            };

            mockRepository.findOne.mockResolvedValue(mockSpecialist);

            await expect(service.publish("test-id")).rejects.toThrow(/service/i);
        });

        it("should throw error when already published", async () => {
            const mockSpecialist = {
                id: "test-id",
                isDraft: false
            };

            mockRepository.findOne.mockResolvedValue(mockSpecialist);

            await expect(service.publish("test-id")).rejects.toThrow(/already published/i);
        });
    });

    describe("findAll", () => {
        it("should return paginated results", async () => {
            const mockItems = [
                { id: "1", title: "Specialist 1" },
                { id: "2", title: "Specialist 2" }
            ];

            const queryBuilder = mockRepository.createQueryBuilder();
            queryBuilder.getManyAndCount.mockResolvedValue([mockItems, 2]);

            const result = await service.findAll({}, 1, 10);

            expect(result.items).toEqual(mockItems);
            expect(result.total).toBe(2);
        });

        it("should filter by search term", async () => {
            const mockItems = [{ id: "1", title: "Accountant" }];
            const queryBuilder = mockRepository.createQueryBuilder();
            queryBuilder.getManyAndCount.mockResolvedValue([mockItems, 1]);

            await service.findAll({ search: "account" }, 1, 10);

            expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
        });
    });

    describe("delete", () => {
        it("should soft delete a specialist", async () => {
            mockRepository.softDelete.mockResolvedValue({ affected: 1 });

            await service.delete("test-id");

            expect(mockRepository.softDelete).toHaveBeenCalledWith("test-id");
        });

        it("should throw error when specialist not found", async () => {
            mockRepository.softDelete.mockResolvedValue({ affected: 0 });

            await expect(service.delete("non-existent")).rejects.toThrow(/not found/i);
        });
    });
});
