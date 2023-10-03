import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query, Headers } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { SearchCategoryDto } from './dtos/search-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService) {}

    @Post()
    async createCategory(@Body() body: CreateCategoryDto, @Headers('authorization') header: string) {
        const category = await this.categoryService.create({...body}, header);

        return category;
    }

    @Get('/:name')
    getCategory(@Param('name') name: string, @Headers('authorization') header: string) {
        return this.categoryService.findOne(name, header);
    }

    @Get()
    getAllCategories(@Body() body: SearchCategoryDto, @Headers('authorization') header: string) {
        return this.categoryService.find(body.name, body.offset, body.limit, header);
    }

    @Patch('/:name')
    editCategory(@Param('name') name: string, @Body() body: UpdateCategoryDto, @Headers('authorization') header: string) {
        return this.categoryService.update(name, body, header);
    }

    @Delete('/:name')
    removeCategory(@Param('name') name: string, @Headers('authorization') header: string) {
        return this.categoryService.remove(name, header);
    }

}
