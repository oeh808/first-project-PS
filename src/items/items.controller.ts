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
        console.log({...body});
        try {
            return await this.itemService.create({...body});
        }catch(error){
            throw new BadRequestException(`Item with SKU: ${body.SKU} already exists.`);
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
    uploadFile(@Param('sku') SKU: string, @UploadedFile() image: Express.Multer.File) {

      return this.itemService.uploadImage(parseInt(SKU), image);
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN, UserRoles.EDITOR])
    @Get('/:sku')
    getItem(@Param('sku') SKU: string) {
        return this.itemService.findOne(parseInt(SKU));
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN, UserRoles.EDITOR])
    @Post('/search')
    getAllItems(@Body() body: SearchItemDto) {
        return this.itemService.find(body.categories);
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN, UserRoles.EDITOR])
    @Patch('/:sku')
    editItem(@Param('sku') SKU: string, @Body() body: EditItemDto) {
        return this.itemService.update(parseInt(SKU), body);
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN])
    @Delete('/:sku')
    removeItem(@Param('sku') SKU: string) {
        return this.itemService.delete(parseInt(SKU));
    }
}
