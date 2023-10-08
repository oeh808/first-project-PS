import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
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

    @IsNumber()
    @IsOptional()
    offset: number;

    @IsNumber()
    @IsOptional()
    limit: number;
}