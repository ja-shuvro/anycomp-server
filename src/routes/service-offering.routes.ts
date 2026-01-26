import { Router } from "express";
import { ServiceOfferingController } from "../controllers/service-offering.controller";
import { validateRequest } from "../middleware/validateRequest";
import { CreateServiceOfferingDto } from "../dto/service-offering/create-service-offering.dto";
import { UpdateServiceOfferingDto } from "../dto/service-offering/update-service-offering.dto";

const router = Router();
const controller = new ServiceOfferingController();

/**
 * Service Offering Routes
 */

// GET /service-offerings - Get all service offerings
router.get("/service-offerings", controller.getAll.bind(controller));

// GET /service-offerings/:id - Get single service offering
router.get("/service-offerings/:id", controller.getOne.bind(controller));

// POST /service-offerings - Create new service offering
router.post(
    "/service-offerings",
    validateRequest(CreateServiceOfferingDto),
    controller.create.bind(controller)
);

// PUT /service-offerings/:id - Update service offering
router.patch(
    "/service-offerings/:id",
    validateRequest(UpdateServiceOfferingDto),
    controller.update.bind(controller)
);

// DELETE /service-offerings/:id - Delete service offering
router.delete("/service-offerings/:id", controller.delete.bind(controller));

export default router;
