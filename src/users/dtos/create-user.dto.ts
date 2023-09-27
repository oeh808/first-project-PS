import { IsEmail, IsString, IsOptional, IsNumber } from "class-validator";

export class CreateUserDto {
    @IsNumber()
    userID: number;
    
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}