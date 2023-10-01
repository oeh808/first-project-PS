import { IsEmail, IsString, IsOptional, IsNumber } from "class-validator";

export class EditUserDto {
    @IsNumber()
    @IsOptional()
    userID: number;
    
    @IsString()
    @IsOptional()
    name: string;

    @IsEmail()
    @IsOptional()
    email: string;
}