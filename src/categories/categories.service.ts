import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Category } from './categories.schema';
import { Model } from 'mongoose';
import { UserRoles } from 'src/users/user-roles.enum';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { SearchCategoryDto } from './dtos/search-category.dto';


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
    
    async find(dto : SearchCategoryDto) {
        const queryOptions = {
            name : "",
            description : ""
        }

        Object.assign(queryOptions,dto);

        const query = this.categoryModel.find({ "name" : { $regex: queryOptions.name, $options: 'i' }, "description" :  { $regex: queryOptions.description, $options: 'i' }});

        // Use offset if applicable
        if(dto.offset){
            query.skip(dto.offset);
        }

        // Use limit if applicable
        if(dto.limit){
            query.limit(dto.limit);
        }

        const res = await query;

        return res;
    }

    // --- UPDATE ---
    //FIXME: Implement optional parameters and use split operator
    async update(name: string, dto: Partial<UpdateCategoryDto>) {

        const category = await this.categoryModel.findOneAndUpdate({name: name}, {...dto}, { new: true, runValidators: true } );

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
