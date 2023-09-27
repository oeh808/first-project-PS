import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService) {}

    @Post()
    async createCategory(@Body() body: CreateCategoryDto) {
        const category = await this.categoryService.create(body.name, body.image, body.description);

        return category;
    }

    @Get('/:name')
    getCategory() {

    }

    @Get()
    getAllCategories() {

    }

    @Patch('/:name')
    editCategory() {

    }

    @Delete('/:name')
    removeCategory() {

    }

}
