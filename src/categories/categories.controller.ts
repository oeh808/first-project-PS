import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query, UseInterceptors, HttpException, HttpStatus, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { SearchCategoryDto } from './dtos/search-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserRoles } from '../users/user-roles.enum';
import { Roles } from '../decorators/role.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService) {}

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN])
    @Post()
    async createCategory(@Body() body: CreateCategoryDto) {
        try {
            return await this.categoryService.create({...body});
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN])
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
    async uploadFile(@Param('name') name: string, @UploadedFile() image: Express.Multer.File) {
      try {
        return await this.categoryService.uploadImage(name, image);
      }catch(error){
        throw new BadRequestException(error.message);
      }
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN, UserRoles.EDITOR])
    @Get('/:name')
    async getCategory(@Param('name') name: string) {
        try {
            return await this.categoryService.findOne(name);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN, UserRoles.EDITOR])
    @Get()
    async getAllCategories(@Body() body: SearchCategoryDto) {
        try {
            return await this.categoryService.find({...body});
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN])
    @Patch('/:name')
    async editCategory(@Param('name') name: string, @Body() body: UpdateCategoryDto) {
        try {
            return await this.categoryService.update(name, body);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.ADMIN])
    @Delete('/:name')
    async removeCategory(@Param('name') name: string) {
        try {
            return await this.categoryService.remove(name);
        }catch(error){
            throw new BadRequestException(error.message);
        }   
    }

}
