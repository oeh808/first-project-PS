import { IsArray } from "class-validator";
import { ObjectId } from "mongoose";


export class AddCategoriesDto {
    @IsArray()
    categories: ObjectId[];
}