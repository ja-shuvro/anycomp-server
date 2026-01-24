import { Router } from "express";
import healthRoutes from "./healthRoutes";

const router = Router();

/**
 * API v1 Routes
 */
router.use("/v1", healthRoutes);

// Future routes will be added here:
// router.use("/v1", platformFeeRoutes);
// router.use("/v1", serviceOfferingRoutes);
// router.use("/v1", specialistRoutes);
// router.use("/v1", mediaRoutes);

export default router;
