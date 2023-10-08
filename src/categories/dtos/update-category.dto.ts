import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    description: string;
}