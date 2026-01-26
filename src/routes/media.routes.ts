import { Router } from "express";
import { MediaController } from "../controllers/media.controller";
import { upload } from "../config/upload.config";

const router = Router();
const controller = new MediaController();

// POST /media/upload - Upload media file
router.post("/media/upload", upload.single("file"), controller.upload.bind(controller));

// DELETE /media/:id - Delete media
router.delete("/media/:id", controller.delete.bind(controller));

// GET /media/specialist/:specialistId - Get all media for a specialist
router.get("/media/specialist/:specialistId", controller.getBySpecialist.bind(controller));

// PATCH /media/:id/reorder - Update display order
router.patch("/media/:id/reorder", controller.reorder.bind(controller));

export default router;
