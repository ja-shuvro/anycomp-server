import { Router } from "express";
import { MediaController } from "../controllers/media.controller";
import { upload } from "../config/upload.config";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { ownershipMiddleware } from "../middleware/ownership.middleware";
import { UserRole } from "../entities/User.entity";

const router = Router();
const controller = new MediaController();

// POST /media/upload - Upload media file
router.post(
    "/media/upload",
    authMiddleware,
    roleMiddleware([UserRole.ADMIN, UserRole.SPECIALIST]),
    ownershipMiddleware("specialist", "body", "specialistId"),
    upload.single("file"),
    controller.upload.bind(controller)
);

// DELETE /media/:id - Delete media
router.delete(
    "/media/:id",
    authMiddleware,
    ownershipMiddleware("media"),
    controller.delete.bind(controller)
);

// GET /media/specialist/:specialistId - Get all media for a specialist
router.get("/media/specialist/:specialistId", controller.getBySpecialist.bind(controller));

// PATCH /media/:id/reorder - Update display order
router.patch(
    "/media/:id/reorder",
    authMiddleware,
    ownershipMiddleware("media"),
    controller.reorder.bind(controller)
);

export default router;
