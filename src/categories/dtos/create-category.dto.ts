import { IsString } from "class-validator";

export class CreateCategoryDto {    
    @IsString()
    name: string;

    @IsString()
    image: string;

    @IsString()
    description: string;
}