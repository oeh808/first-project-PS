import { IsArray } from "class-validator";
import { ObjectId } from "mongoose";


export class SearchItemDto {
    @IsArray()
    categories: ObjectId[];
}