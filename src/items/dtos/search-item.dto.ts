import { IsArray, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongoose";


export class SearchItemDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsArray()
    @IsOptional()
    categories: string[];
}