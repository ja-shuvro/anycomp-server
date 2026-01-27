import { Router } from "express";
import { PlatformFeeController } from "../controllers/platform-fee.controller";
import { validateRequest } from "../middleware/validateRequest";
import { CreatePlatformFeeDto } from "../dto/platform-fee/create-platform-fee.dto";
import { UpdatePlatformFeeDto } from "../dto/platform-fee/update-platform-fee.dto";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { UserRole } from "../entities/User.entity";

const router = Router();
const controller = new PlatformFeeController();

/**
 * Platform Fee Routes
 * Mounted at /v1 in routes/index.ts
 */

// GET /v1/platform-fees - Get all platform fee tiers
router.get("/platform-fees", authMiddleware, roleMiddleware([UserRole.ADMIN]), controller.getAll.bind(controller));

// GET /v1/platform-fees/:id - Get platform fee by ID
router.get("/platform-fees/:id", authMiddleware, roleMiddleware([UserRole.ADMIN]), controller.getOne.bind(controller));

// POST /v1/platform-fees - Create new platform fee tier
router.post(
    "/platform-fees",
    authMiddleware,
    roleMiddleware([UserRole.ADMIN]),
    validateRequest(CreatePlatformFeeDto),
    controller.create.bind(controller)
);

// PATCH /v1/platform-fees/:id - Update platform fee tier (partial update)
router.patch(
    "/platform-fees/:id",
    authMiddleware,
    roleMiddleware([UserRole.ADMIN]),
    validateRequest(UpdatePlatformFeeDto),
    controller.update.bind(controller)
);

// DELETE /v1/platform-fees/:id - Delete platform fee tier
router.delete("/platform-fees/:id", authMiddleware, roleMiddleware([UserRole.ADMIN]), controller.delete.bind(controller));

export default router;
