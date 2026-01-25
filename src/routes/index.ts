import { Router } from "express";
import healthRoutes from "./healthRoutes";
import platformFeeRoutes from "./platform-fee.routes";

const router = Router();

/**
 * API v1 Routes
 */
router.use("/v1", healthRoutes);
router.use("/v1", platformFeeRoutes);

// Future routes will be added here:
// router.use("/v1", serviceOfferingRoutes);
// router.use("/v1", specialistRoutes);
// router.use("/v1", mediaRoutes);

export default router;
