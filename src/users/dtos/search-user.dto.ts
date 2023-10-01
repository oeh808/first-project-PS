import { IsEmail, IsString, IsOptional, IsNumber } from "class-validator";

export class SearchUserDto {
    @IsNumber()
    @IsOptional()
    userID: number;
    
    @IsString()
    @IsOptional()
    name: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsNumber()
    offset: number;

    @IsNumber()
    limit: number;
}