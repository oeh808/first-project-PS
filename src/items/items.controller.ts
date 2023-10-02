import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query, UseGuards, Headers } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { EditItemDto } from './dtos/edit-item.dto';

@Controller('items')
export class ItemsController {
    constructor(private itemService: ItemsService) {}

    @Post()
    createItem(@Body() body: CreateItemDto, @Headers('authorization') header: string) {
        return this.itemService.create(body.SKU, body.name, body.image, body.description, body.categories, header);
    }

    @Get('/:sku')
    getItem(@Param('sku') SKU: string, @Headers('authorization') header: string) {
        return this.itemService.findOne(parseInt(SKU), header);
    }

    @Get()
    getAllItems() {

    }

    @Patch('/:sku')
    editItem(@Param('sku') SKU: string, @Body() body: EditItemDto, @Headers('authorization') header: string) {
        return this.itemService.update(parseInt(SKU), body, header);
    }

    @Delete('/:sku')
    removeItem(@Param('sku') SKU: string, @Headers('authorization') header: string) {
        return this.itemService.delete(parseInt(SKU), header);
    }

    // Related to Categories

}
