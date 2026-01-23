import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: "Please provide a valid email address" })
    email: string;

    @IsString({ message: "Name must be a string" })
    @MinLength(2, { message: "Name must be at least 2 characters long" })
    @MaxLength(100, { message: "Name must not exceed 100 characters" })
    name: string;
}
