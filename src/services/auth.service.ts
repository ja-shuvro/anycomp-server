import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User.entity";
import { RegisterDto } from "../dto/auth/register.dto";
import { LoginDto } from "../dto/auth/login.dto";
import { BadRequestError, UnauthorizedError } from "../errors/custom-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

export class AuthService {
    private userRepo = AppDataSource.getRepository(User);

    /**
     * Register a new user
     */
    async register(dto: RegisterDto): Promise<Omit<User, "password">> {
        // Check if user already exists
        const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existingUser) {
            throw new BadRequestError("User with this email already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 12);

        // Create user
        const user = this.userRepo.create({
            ...dto,
            password: hashedPassword,
            role: dto.role || UserRole.CLIENT
        });

        const savedUser = await this.userRepo.save(user);
        logger.info(`User registered: ${savedUser.email}`);

        // Remove password from response
        const { password: _password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword as User;
    }

    /**
     * Login user and generate JWT
     */
    async login(dto: LoginDto): Promise<{ user: Omit<User, "password">; token: string }> {
        // Find user and include password for verification
        const user = await this.userRepo.createQueryBuilder("user")
            .where("user.email = :email", { email: dto.email })
            .addSelect("user.password")
            .getOne();

        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid credentials");
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: (process.env.JWT_EXPIRES_IN as any) || "24h" }
        );

        logger.info(`User logged in: ${user.email}`);

        // Remove password from response
        const { password: _password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword as User,
            token
        };
    }

    /**
     * Get user by ID
     */
    async findById(id: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { id } });
    }
}
