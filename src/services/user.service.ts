import { AppDataSource } from "../data-source";
import { User } from "../entities/User.entity";
import { NotFoundError } from "../errors/custom-errors";
import logger from "../utils/logger";

export class UserService {
    private userRepo = AppDataSource.getRepository(User);

    /**
     * Get all users with pagination
     */
    async findAll(page: number, limit: number): Promise<{ items: Omit<User, "password">[]; total: number }> {
        const skip = (page - 1) * limit;

        const [users, total] = await this.userRepo.findAndCount({
            skip,
            take: limit,
            order: { createdAt: "DESC" },
            select: ["id", "email", "role", "createdAt", "updatedAt"]
        });

        return { items: users, total };
    }

    /**
     * Find user by ID
     */
    async findOne(id: string): Promise<Omit<User, "password">> {
        const user = await this.userRepo.findOne({
            where: { id },
            select: ["id", "email", "role", "createdAt", "updatedAt"]
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    }

    /**
     * Delete user
     */
    async delete(id: string): Promise<void> {
        const user = await this.userRepo.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        await this.userRepo.remove(user);
        logger.info(`User deleted: ${user.email}`);
    }
}
