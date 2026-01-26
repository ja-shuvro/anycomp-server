import { Router } from "express";
import { HealthController } from "../controllers/health.controller";

const router = Router();

/**
 * Health routes
 */
router.get("/health", HealthController.check);

export default router;
