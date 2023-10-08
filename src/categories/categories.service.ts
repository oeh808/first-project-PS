import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Category } from './categories.schema';
import { Model } from 'mongoose';
import { UserRoles } from 'src/users/user-roles.enum';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';


@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

    // --- CREATE ---
    async create(dto: CreateCategoryDto) {
        const category = new this.categoryModel({...dto});

        return category.save();
    }

    // --- GET ---
    async findOne(name: string) {
        const category = await this.categoryModel.find({name: name});
        if (!category){
            return new NotFoundException("Category not found.");
        }
        
        return category;
    }
    
    //FIXME: Implement optional parameters and use split operator
    async find(name: string, offset: number, limit: number) {
        return this.categoryModel.find({ "name" : { $regex: name, $options: 'i' } }).skip(offset).limit(limit);
    }

    // --- UPDATE ---
    //FIXME: Implement optional parameters and use split operator
    async update(name: string, attrs: UpdateCategoryDto) {

        const category = await this.categoryModel.findOneAndUpdate({name: name}, {image: attrs.image, description: attrs.description}, { new: true, runValidators: true } );
        if(!category){
            return new NotFoundException("Category not found.");
        }

        return category;
    }

    async uploadImage(name: string, image: Express.Multer.File) {

        const category = await this.categoryModel.findOneAndUpdate({name: name}, {image: image.filename}, {new: true});

        return category;
    }

    // --- DELETE ---
    async remove(name: string) {

        const category = await this.categoryModel.findOneAndDelete({name: name});
        if (!category){
            return new NotFoundException("Category not found.");
        }
        
        return category;
    }

}
