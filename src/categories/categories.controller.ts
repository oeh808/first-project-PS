import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { SearchCategoryDto } from './dtos/search-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService) {}

    @Post()
    async createCategory(@Body() body: CreateCategoryDto) {
        const category = await this.categoryService.create(body.name, body.image, body.description);

        return category;
    }

    @Get('/:name')
    getCategory(@Param('name') name: string) {
        return this.categoryService.findOne(name);
    }

    @Get()
    getAllCategories(@Body() body: SearchCategoryDto) {
        return this.categoryService.find(body.name, body.offset, body.limit);
    }

    @Patch('/:name')
    editCategory(@Param('name') name: string, @Body() body: UpdateCategoryDto) {
        return this.categoryService.update(name, body);
    }

    @Delete('/:name')
    removeCategory(@Param('name') name: string) {
        return this.categoryService.remove(name);
    }

}
