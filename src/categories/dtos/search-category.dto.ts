import { IsNumber, IsString } from "class-validator";

export class SearchCategoryDto {    
    @IsString()
    name: string;

    @IsNumber()
    offset: number;

    @IsNumber()
    limit: number;

}