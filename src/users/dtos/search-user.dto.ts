import { IsEmail, IsString, IsOptional, IsNumber } from "class-validator";

export class SearchUserDto {    
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsNumber()
    @IsOptional()
    offset: number;

    @IsNumber()
    @IsOptional()
    limit: number;
}