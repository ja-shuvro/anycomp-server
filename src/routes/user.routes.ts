import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { UserRole } from "../entities/User.entity";

const router = Router();
const controller = new UserController();

/**
 * User Management Routes (Admin only)
 */

// GET /users - Get all users
router.get(
    "/users",
    authMiddleware,
    roleMiddleware([UserRole.ADMIN]),
    controller.getAll.bind(controller)
);

// GET /users/:id - Get single user
router.get(
    "/users/:id",
    authMiddleware,
    roleMiddleware([UserRole.ADMIN]),
    controller.getOne.bind(controller)
);

// DELETE /users/:id - Delete user
router.delete(
    "/users/:id",
    authMiddleware,
    roleMiddleware([UserRole.ADMIN]),
    controller.delete.bind(controller)
);

export default router;
