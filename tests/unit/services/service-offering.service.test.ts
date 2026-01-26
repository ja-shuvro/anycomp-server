import { ServiceOfferingService } from "../../../src/services/service-offering.service";
import { AppDataSource } from "../../../src/data-source";
import { NotFoundError, ConflictError } from "../../../src/errors/custom-errors";

jest.mock("../../../src/data-source");

describe("ServiceOfferingService", () => {
    let service: ServiceOfferingService;
    let mockRepository: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            delete: jest.fn(),
        };

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
        it("should create a new service offering", async () => {
            const dto = { serviceId: "S1", title: "New Service", basePrice: 100 };
            const mockSaved = { id: "uuid", ...dto };

            mockRepository.findOne.mockResolvedValue(null); // No duplicate
            mockRepository.create.mockReturnValue(dto);
            mockRepository.save.mockResolvedValue(mockSaved);

            const result = await service.create(dto as any);

            expect(result).toEqual(mockSaved);
            expect(mockRepository.create).toHaveBeenCalledWith(dto);
            expect(mockRepository.save).toHaveBeenCalled();
        });

        it("should throw ConflictError if serviceId already exists", async () => {
            const dto = { serviceId: "S1", title: "New Service" };
            mockRepository.findOne.mockResolvedValue({ id: "existing" });

            await expect(service.create(dto as any)).rejects.toThrow(ConflictError);
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
