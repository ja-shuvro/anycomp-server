import { Router } from "express";
import platformFeeRoutes from "./platform-fee.routes";
import serviceOfferingRoutes from "./service-offering.routes";
import healthRoutes from "./health.routes";
import specialistRoutes from "./specialist.routes";
import mediaRoutes from "./media.routes";

const router = Router();

// API version 1 routes
router.use("/v1", healthRoutes);
router.use("/v1", platformFeeRoutes);
router.use("/v1", serviceOfferingRoutes);
router.use("/v1", specialistRoutes);
router.use("/v1", mediaRoutes);

export default router;
