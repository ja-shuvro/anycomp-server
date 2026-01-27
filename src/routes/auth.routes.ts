import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validateRequest";
import { RegisterDto } from "../dto/auth/register.dto";
import { LoginDto } from "../dto/auth/login.dto";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

// Register /auth/register
router.post("/register", validateRequest(RegisterDto), authController.register);

// Login /auth/login
router.post("/login", validateRequest(LoginDto), authController.login);

// Get Me /auth/me
router.get("/me", authMiddleware, authController.getMe);

export default router;
