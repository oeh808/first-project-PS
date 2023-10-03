import { IsEmail, IsString, IsOptional, IsNumber, IsArray } from "class-validator";
import { ObjectId } from "mongodb";

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

    @IsArray()
    @IsOptional()
    categories: ObjectId[]
}