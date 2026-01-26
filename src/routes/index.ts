import { Router } from "express";
import healthRoutes from "./health.routes";
import platformFeeRoutes from "./platform-fee.routes";
import serviceOfferingRoutes from "./service-offering.routes";
import specialistRoutes from "./specialist.routes";

const router = Router();

/**
 * API v1 Routes
 */
router.use("/v1", healthRoutes);
router.use("/v1", platformFeeRoutes);
router.use("/v1", serviceOfferingRoutes);
router.use("/v1", specialistRoutes);

// Future routes will be added here:
// router.use("/v1", mediaRoutes);

export default router;
