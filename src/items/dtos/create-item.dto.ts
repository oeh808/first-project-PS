import { Transform, TransformPlainToInstance, Type, plainToClass } from "class-transformer";
import { IsEmail, IsString, IsOptional, IsNumber, IsArray, isMongoId } from "class-validator";
import { ObjectId } from "mongodb";
import mongoose, { isObjectIdOrHexString, isValidObjectId } from "mongoose";

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
    //@Transform(({ value }) => new mongoose.Types.ObjectId(value))
    categories: ObjectId[];
}