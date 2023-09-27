import { IsEmail, IsString, IsOptional, IsNumber } from "class-validator";

export class SearchUserDto {
    @IsNumber()
    userID: number;
    
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsNumber()
    offset: number;

    @IsNumber()
    limit: number;
}