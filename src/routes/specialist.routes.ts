import { Router } from "express";
import { SpecialistController } from "../controllers/specialist.controller";
import { validateRequest } from "../middleware/validateRequest";
import { CreateSpecialistDto } from "../dto/specialist/create-specialist.dto";
import { UpdateSpecialistDto } from "../dto/specialist/update-specialist.dto";

const router = Router();
const controller = new SpecialistController();

/**
 * Specialist Routes
 */

// GET /specialists - Get all specialists (filtered)
router.get("/specialists", controller.getAll.bind(controller));

// GET /specialists/:id - Get specialist by ID
router.get("/specialists/:id", controller.getOne.bind(controller));

// POST /specialists - Create new specialist
router.post(
    "/specialists",
    validateRequest(CreateSpecialistDto),
    controller.create.bind(controller)
);

// PATCH /specialists/:id - Update specialist
router.patch(
    "/specialists/:id",
    validateRequest(UpdateSpecialistDto),
    controller.update.bind(controller)
);

// DELETE /specialists/:id - Delete specialist
router.delete("/specialists/:id", controller.delete.bind(controller));

export default router;
