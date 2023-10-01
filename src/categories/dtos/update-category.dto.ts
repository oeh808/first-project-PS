import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {    
    @IsOptional()
    @IsString()
    image: string;

    @IsOptional()
    @IsString()
    description: string;

}