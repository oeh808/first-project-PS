import { IsEmail, IsString, IsOptional, IsNumber, IsArray } from "class-validator";

export class CreateItemDto {
    @IsNumber()
    SKU: number;
    
    @IsString()
    name: string;

    @IsString()
    image: string;

    @IsString()
    description: string;

    @IsArray()
    @IsOptional()
    categories: [];
}