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
    // ownershipMiddleware removed - handled in service to allow uploads without specialistId
    upload.single("file"),
    controller.upload.bind(controller)
);

// PUT /media/:id - Update media (specialist assignment and/or display order)
router.put(
    "/media/:id",
    authMiddleware,
    // Ownership checked in service based on existing and new specialistId
    controller.update.bind(controller)
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
