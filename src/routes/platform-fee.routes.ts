import { Router } from "express";
import { PlatformFeeController } from "../controllers/platform-fee.controller";
import { validateRequest } from "../middleware/validateRequest";
import { CreatePlatformFeeDto } from "../dto/platform-fee/create-platform-fee.dto";
import { UpdatePlatformFeeDto } from "../dto/platform-fee/update-platform-fee.dto";

const router = Router();
const controller = new PlatformFeeController();

/**
 * Platform Fee Routes
 * Mounted at /v1 in routes/index.ts
 */

// GET /v1/platform-fees - Get all platform fee tiers
router.get("/platform-fees", controller.getAll.bind(controller));

// GET /v1/platform-fees/:id - Get platform fee by ID
router.get("/platform-fees/:id", controller.getOne.bind(controller));

// POST /v1/platform-fees - Create new platform fee tier
router.post(
    "/platform-fees",
    validateRequest(CreatePlatformFeeDto),
    controller.create.bind(controller)
);

// PATCH /v1/platform-fees/:id - Update platform fee tier (partial update)
router.patch(
    "/platform-fees/:id",
    validateRequest(UpdatePlatformFeeDto),
    controller.update.bind(controller)
);

// DELETE /v1/platform-fees/:id - Delete platform fee tier
router.delete("/platform-fees/:id", controller.delete.bind(controller));

export default router;
