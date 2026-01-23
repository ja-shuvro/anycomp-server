import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateRequest } from "../middleware/validateRequest";
import { CreateUserDto } from "../dto/CreateUserDto";

const router = Router();
const userController = new UserController();

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post("/", validateRequest(CreateUserDto), userController.createUser);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get("/", userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get("/:id", userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user by ID
 * @access  Public
 */
router.put("/:id", validateRequest(CreateUserDto), userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user by ID
 * @access  Public
 */
router.delete("/:id", userController.deleteUser);

export default router;
