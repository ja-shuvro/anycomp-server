import { Router } from "express";
import userRoutes from "./userRoutes";

const router = Router();

// Mount routes
router.use("/users", userRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

export default router;
