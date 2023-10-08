import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query, UseGuards, BadRequestException, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { EditItemDto } from './dtos/edit-item.dto';
import { SearchItemDto } from './dtos/search-item.dto';
import { AddCategoriesDto } from './dtos/add-categories.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../decorators/role.decorator';
import { UserRoles } from '../users/user-roles.enum';

@Controller('items')
export class ItemsController {
    constructor(private itemService: ItemsService) {}

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN, UserRoles.EDITOR])
    @Post()
    async createItem(@Body() body: CreateItemDto) {
        try {
            return await this.itemService.create({...body});
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN, UserRoles.EDITOR])
    @Post('upload/:sku')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
          destination: './images/items'
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
      async uploadFile(@Param('sku') SKU: string, @UploadedFile() image: Express.Multer.File) {
      try {
            return await this.itemService.uploadImage(parseInt(SKU), image);
      }catch(error){
            throw new BadRequestException(error.message);
      }
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN, UserRoles.EDITOR])
    @Get('/:sku')
    async getItem(@Param('sku') SKU: string) {
        try {
            return await this.itemService.findOne(parseInt(SKU));
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN, UserRoles.EDITOR])
    @Post('/search')
    async getAllItems(@Body() body: SearchItemDto) {
        try {
            return await this.itemService.find({...body});
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN, UserRoles.EDITOR])
    @Patch('/:sku')
    async editItem(@Param('sku') SKU: string, @Body() body: EditItemDto) {
        try {
            return await this.itemService.update(parseInt(SKU), body);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN])
    @Delete('/:sku')
    async removeItem(@Param('sku') SKU: string) {
        try {
            return await this.itemService.delete(parseInt(SKU));
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }
}
