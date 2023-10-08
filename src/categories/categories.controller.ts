import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query, Headers, UseInterceptors, HttpException, HttpStatus, UploadedFile, BadRequestException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { SearchCategoryDto } from './dtos/search-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService) {}

    @Post()
    async createCategory(@Body() body: CreateCategoryDto, @Headers('authorization') header: string) {
        try {
            return await this.categoryService.create({...body}, header);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @Post('upload/:name')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
          destination: './images/categories'
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
    uploadFile(@Param('name') name: string, @UploadedFile() image: Express.Multer.File, @Headers('authorization') header: string) {
      try {
        return this.categoryService.uploadImage(name, image, header);
      }catch(error){
        throw new BadRequestException(error.message);
      }
    }

    @Get('/:name')
    getCategory(@Param('name') name: string, @Headers('authorization') header: string) {
        try {
            return this.categoryService.findOne(name, header);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @Get()
    getAllCategories(@Body() body: SearchCategoryDto, @Headers('authorization') header: string) {
        try {
            return this.categoryService.find(body.name, body.offset, body.limit, header);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @Patch('/:name')
    editCategory(@Param('name') name: string, @Body() body: UpdateCategoryDto, @Headers('authorization') header: string) {
        try {
            return this.categoryService.update(name, body, header);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @Delete('/:name')
    removeCategory(@Param('name') name: string, @Headers('authorization') header: string) {
        try {
            return this.categoryService.remove(name, header);
        }catch(error){
            throw new BadRequestException(error.message);
        }   
    }

}
