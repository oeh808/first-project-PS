import { IsEmail, IsString, IsOptional, IsNumber } from "class-validator";

export class EditItemDto {    
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    image: string;

    @IsString()
    @IsOptional()
    description: string;
}