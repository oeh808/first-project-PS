import { IsEmail, IsString, IsOptional, IsNumber } from "class-validator";

export class ResetUserPasswordDto {
    @IsString()
    password: string;
}