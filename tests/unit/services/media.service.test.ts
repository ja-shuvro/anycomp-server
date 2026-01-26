import { MediaService } from "../../../src/services/media.service";
import { AppDataSource } from "../../../src/data-source";
import { NotFoundError } from "../../../src/errors/custom-errors";
import fs from "fs";

jest.mock("../../../src/data-source");
jest.mock("fs");

describe("MediaService", () => {
    let service: MediaService;
    let mockMediaRepo: any;
    let mockSpecialistRepo: any;
    let mockQueryBuilder: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockQueryBuilder = {
            where: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue({ max: 5 }),
        };

        mockMediaRepo = {
            create: jest.fn().mockImplementation((dto) => ({ id: "M1", ...dto })),
            save: jest.fn().mockImplementation((media) => Promise.resolve({ id: "M1", ...media })),
            findOne: jest.fn(),
            find: jest.fn(),
            softDelete: jest.fn(),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
        };

        mockSpecialistRepo = {
            findOne: jest.fn(),
        };

        (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
            if (entity.name === "Media") return mockMediaRepo;
            if (entity.name === "Specialist") return mockSpecialistRepo;
            return null;
        });

        service = new MediaService();
    });

    describe("upload", () => {
        const mockFile = {
            filename: "test.jpg",
            path: "/tmp/test.jpg",
            size: 1024,
            mimetype: "image/jpeg",
        } as any;

        it("should upload media for a valid specialist", async () => {
            mockSpecialistRepo.findOne.mockResolvedValue({ id: "S1" });

            const result = await service.upload("S1", mockFile);

            expect(result.id).toBeDefined();
            expect(mockSpecialistRepo.findOne).toHaveBeenCalledWith({ where: { id: "S1" } });
            expect(mockMediaRepo.create).toHaveBeenCalled();
            expect(mockMediaRepo.save).toHaveBeenCalled();
        });

        it("should calculate displayOrder if not provided", async () => {
            mockSpecialistRepo.findOne.mockResolvedValue({ id: "S1" });
            mockQueryBuilder.getRawOne.mockResolvedValue({ max: 2 });

            await service.upload("S1", mockFile);

            expect(mockMediaRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                displayOrder: 3,
            }));
        });

        it("should throw NotFoundError and clean up file if specialist not found", async () => {
            mockSpecialistRepo.findOne.mockResolvedValue(null);

            await expect(service.upload("S1", mockFile)).rejects.toThrow(NotFoundError);
            expect(fs.unlinkSync).toHaveBeenCalledWith(mockFile.path);
        });
    });

    describe("delete", () => {
        it("should delete media and remove physical file", async () => {
            const mockMedia = { id: "M1", fileName: "test.jpg" };
            mockMediaRepo.findOne.mockResolvedValue(mockMedia);
            (fs.existsSync as jest.Mock).mockReturnValue(true);

            await service.delete("M1");

            expect(fs.unlinkSync).toHaveBeenCalled();
            expect(mockMediaRepo.softDelete).toHaveBeenCalledWith("M1");
        });

        it("should throw NotFoundError if media not found", async () => {
            mockMediaRepo.findOne.mockResolvedValue(null);

            await expect(service.delete("M1")).rejects.toThrow(NotFoundError);
        });
    });

    describe("getBySpecialist", () => {
        it("should return media for a specialist", async () => {
            const mockMediaList = [{ id: "M1" }];
            mockMediaRepo.find.mockResolvedValue(mockMediaList);

            const result = await service.getBySpecialist("S1");

            expect(result).toEqual(mockMediaList);
            expect(mockMediaRepo.find).toHaveBeenCalledWith(expect.objectContaining({
                where: { specialists: "S1" },
            }));
        });
    });

    describe("reorder", () => {
        it("should update display order", async () => {
            const mockMedia = { id: "M1", displayOrder: 1 };
            mockMediaRepo.findOne.mockResolvedValue(mockMedia);

            const result = await service.reorder("M1", 5);

            expect(result.displayOrder).toBe(5);
            expect(mockMediaRepo.save).toHaveBeenCalled();
        });

        it("should throw NotFoundError if media to reorder not found", async () => {
            mockMediaRepo.findOne.mockResolvedValue(null);

            await expect(service.reorder("M1", 5)).rejects.toThrow(NotFoundError);
        });
    });
});
