import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/auth/register.dto";
import { LoginDto } from "../dto/auth/login.dto";
import { successResponse } from "../utils/response.helper";

export class AuthController {
    private authService = new AuthService();

    /**
     * POST /api/v1/auth/register
     */
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: RegisterDto = req.body;
            const user = await this.authService.register(dto);
            return successResponse(res, user, "User registered successfully", 201);
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /api/v1/auth/login
     */
    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: LoginDto = req.body;
            const result = await this.authService.login(dto);
            return successResponse(res, result, "Login successful");
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/v1/user/me
     * Protected route to get current user info
     */
    getMe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return successResponse(res, null, "Not authenticated", 401);
            }
            const user = await this.authService.findById(userId);
            return successResponse(res, user);
        } catch (error) {
            next(error);
        }
    };
}
