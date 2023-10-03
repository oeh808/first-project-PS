import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query, UseGuards, Headers, BadRequestException } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { EditItemDto } from './dtos/edit-item.dto';
import { SearchItemDto } from './dtos/search-item.dto';
import { AddCategoriesDto } from './dtos/add-categories.dto';

@Controller('items')
export class ItemsController {
    constructor(private itemService: ItemsService) {}

    @Post()
    async createItem(@Body() body: CreateItemDto, @Headers('authorization') header: string) {
        console.log({...body});
        try {
            return await this.itemService.create({...body}, header);
        }catch(error){
            throw new BadRequestException(`Item with SKU: ${body.SKU} already exists.`);
        }
    }

    @Get('/:sku')
    getItem(@Param('sku') SKU: string, @Headers('authorization') header: string) {
        return this.itemService.findOne(parseInt(SKU), header);
    }

    @Post('/search')
    getAllItems(@Body() body: SearchItemDto, @Headers('authorization') header: string) {
        return this.itemService.find(body.categories,header);
    }

    @Patch('/:sku')
    editItem(@Param('sku') SKU: string, @Body() body: EditItemDto, @Headers('authorization') header: string) {
        return this.itemService.update(parseInt(SKU), body, header);
    }

    @Delete('/:sku')
    removeItem(@Param('sku') SKU: string, @Headers('authorization') header: string) {
        return this.itemService.delete(parseInt(SKU), header);
    }
}
