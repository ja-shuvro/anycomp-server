import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { CreateUserDto } from "../dto/CreateUserDto";
import { AppError } from "../middleware/errorHandler";

export class UserService {
    private userRepository = AppDataSource.getRepository(User);

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new AppError("User with this email already exists", 409);
        }

        // Create new user
        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }

    async findAllUsers(): Promise<User[]> {
        return await this.userRepository.find({
            order: { createdAt: "DESC" },
        });
    }

    async findUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    }

    async updateUser(id: string, updateData: Partial<CreateUserDto>): Promise<User> {
        const user = await this.findUserById(id);

        // Check email uniqueness if email is being updated
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await this.userRepository.findOne({
                where: { email: updateData.email },
            });

            if (existingUser) {
                throw new AppError("Email already in use", 409);
            }
        }

        Object.assign(user, updateData);
        return await this.userRepository.save(user);
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.findUserById(id);
        await this.userRepository.remove(user);
    }
}
