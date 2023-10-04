import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query, UseGuards, Headers, BadRequestException, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { EditItemDto } from './dtos/edit-item.dto';
import { SearchItemDto } from './dtos/search-item.dto';
import { AddCategoriesDto } from './dtos/add-categories.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadItemImageDto } from './dtos/upload-item-image.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

    @Post('upload/:sku')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
          destination: './misc'
          , filename: (req, image, cb) => {
            // Generating a 32 random chars long string
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
            //Calling the callback passing the random name generated with the original extension name
            cb(null, `${randomName}${extname(image.originalname)}`)
          }
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image')) {
                cb(null, true);
            }else {
                cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
            }
        }
      }))
    uploadFile(@Param('sku') SKU: string, @UploadedFile() image: Express.Multer.File, @Headers('authorization') header: string) {

      return this.itemService.uploadImage(parseInt(SKU), image, header);
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
