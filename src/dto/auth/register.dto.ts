import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from "class-validator";
import { UserRole } from "../../entities/User.entity";

export class RegisterDto {
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    @MinLength(6, { message: "Password must be at least 6 characters" })
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
