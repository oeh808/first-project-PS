import { IsNumber, IsOptional, IsString } from "class-validator";

export class SearchCategoryDto {    
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsOptional()
    offset: number;

    @IsNumber()
    @IsOptional()
    limit: number;

}