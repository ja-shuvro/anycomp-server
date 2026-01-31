import { ServiceOfferingService } from "../../../src/services/service-offering.service";
import { AppDataSource } from "../../../src/data-source";
import { NotFoundError } from "../../../src/errors/custom-errors";
import { Specialist } from "../../../src/entities/Specialist.entity";
import { ServiceOfferingsMasterList } from "../../../src/entities/ServiceOfferingsMasterList.entity";
import { ServiceOffering } from "../../../src/entities/ServiceOffering.entity";

jest.mock("../../../src/data-source");

describe("ServiceOfferingService", () => {
    let service: ServiceOfferingService;
    let mockRepository: any;
    let mockQueryRunner: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            delete: jest.fn(),
        };

        const mockManager = {
            getRepository: jest.fn((entity) => {
                if (entity === Specialist) {
                    return {
                        findOne: jest.fn(),
                    };
                }
                if (entity === ServiceOfferingsMasterList) {
                    return {
                        create: jest.fn(),
                    };
                }
                if (entity === ServiceOffering) {
                    return {
                        create: jest.fn(),
                    };
                }
                return mockRepository;
            }),
            save: jest.fn(),
        };

        mockQueryRunner = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: mockManager,
        };

        (AppDataSource.createQueryRunner as jest.Mock) = jest.fn().mockReturnValue(mockQueryRunner);
        (AppDataSource.getRepository as jest.Mock) = jest.fn().mockReturnValue(mockRepository);
        service = new ServiceOfferingService();
    });

    describe("findAll", () => {
        it("should return paginated results", async () => {
            const mockItems = [{ id: "1", title: "Test Service" }];
            const mockTotal = 1;
            mockRepository.findAndCount.mockResolvedValue([mockItems, mockTotal]);

            const result = await service.findAll(1, 10);

            expect(result.items).toEqual(mockItems);
            expect(result.total).toBe(mockTotal);
            expect(mockRepository.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
                skip: 0,
                take: 10,
            }));
        });
    });

    describe("findOne", () => {
        it("should return a service offering by id", async () => {
            const mockItem = { id: "1", title: "Test Service" };
            mockRepository.findOne.mockResolvedValue(mockItem);

            const result = await service.findOne("1");

            expect(result).toEqual(mockItem);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
        });

        it("should throw NotFoundError if service not found", async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne("non-existent")).rejects.toThrow(NotFoundError);
        });
    });

    describe("create", () => {
        it("should create a new service offering and junction entry", async () => {
            const dto = { specialistId: "spec-123", title: "New Service", description: "Test description with length" };
            const mockSpecialist = { id: "spec-123", title: "Test Specialist" };
            const mockSavedMasterList = { id: "master-123", ...dto };
            const mockServiceOffering = { id: "junction-123" };

            // Mock specialist repository
            const mockSpecialistRepo = mockQueryRunner.manager.getRepository(Specialist);
            mockSpecialistRepo.findOne.mockResolvedValue(mockSpecialist);

            // Mock service offerings master list repository
            const mockMasterListRepo = mockQueryRunner.manager.getRepository(ServiceOfferingsMasterList);
            mockMasterListRepo.create.mockReturnValue(mockSavedMasterList);

            // Mock service offering repository
            const mockJunctionRepo = mockQueryRunner.manager.getRepository(ServiceOffering);
            mockJunctionRepo.create.mockReturnValue(mockServiceOffering);

            // Mock manager save
            mockQueryRunner.manager.save
                .mockResolvedValueOnce(mockSavedMasterList) // First call for master list
                .mockResolvedValueOnce(mockServiceOffering); // Second call for junction

            const result = await service.create(dto as any);

            expect(result).toEqual(mockSavedMasterList);
            expect(mockQueryRunner.connect).toHaveBeenCalled();
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });

        it("should throw NotFoundError if specialist does not exist", async () => {
            const dto = { specialistId: "non-existent", title: "New Service", description: "Test" };

            const mockSpecialistRepo = mockQueryRunner.manager.getRepository(Specialist);
            mockSpecialistRepo.findOne.mockResolvedValue(null);

            await expect(service.create(dto as any)).rejects.toThrow(NotFoundError);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });
    });

    describe("update", () => {
        it("should update an existing service offering", async () => {
            const mockExisting = { id: "1", title: "Old Title" };
            const dto = { title: "New Title" };
            const mockUpdated = { ...mockExisting, ...dto };

            mockRepository.findOne.mockResolvedValue(mockExisting);
            mockRepository.save.mockResolvedValue(mockUpdated);

            const result = await service.update("1", dto as any);

            expect(result.title).toBe("New Title");
            expect(mockRepository.save).toHaveBeenCalled();
        });

        it("should throw NotFoundError if service to update does not exist", async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.update("1", { title: "New" } as any)).rejects.toThrow(NotFoundError);
        });
    });

    describe("delete", () => {
        it("should delete a service offering", async () => {
            mockRepository.delete.mockResolvedValue({ affected: 1 });

            await service.delete("1");

            expect(mockRepository.delete).toHaveBeenCalledWith("1");
        });

        it("should throw NotFoundError if service to delete does not exist", async () => {
            mockRepository.delete.mockResolvedValue({ affected: 0 });

            await expect(service.delete("1")).rejects.toThrow(NotFoundError);
        });
    });
});
