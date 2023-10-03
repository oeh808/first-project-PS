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
    async create(dto: CreateCategoryDto, header: string) {
        if(! await this.isAllowed(header, UserRoles.ADMIN.toString())){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const category = new this.categoryModel({...dto});

        return category.save();
    }

    // --- GET ---
    async findOne(name: string, header: string) {
        if((! await this.isAllowed(header, UserRoles.ADMIN.toString())) && (!await this.isAllowed(header, UserRoles.EDITOR.toString()))){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const category = await this.categoryModel.find({name: name});
        if (!category){
            return new NotFoundException("Category not found.");
        }
        
        return category;
    }
    
    async find(name: string, offset: number, limit: number, header: string) {
        if((! await this.isAllowed(header, UserRoles.ADMIN.toString())) && (!await this.isAllowed(header, UserRoles.EDITOR.toString()))){
            throw new UnauthorizedException("You do not have permission to do that.");
        }
        return this.categoryModel.find({ "name" : { $regex: name, $options: 'i' } }).skip(offset).limit(limit);
    }

    // --- UPDATE ---
    async update(name: string, attrs: UpdateCategoryDto, header: string) {
        if(! await this.isAllowed(header, UserRoles.ADMIN.toString())){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const category = await this.categoryModel.findOneAndUpdate({name: name}, {image: attrs.image, description: attrs.description}, { new: true, runValidators: true } );
        if(!category){
            return new NotFoundException("Category not found.");
        }

        return category;
    }

    // --- DELETE ---
    async remove(name: string, header: string) {
        if(! await this.isAllowed(header, UserRoles.ADMIN.toString())){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const category = await this.categoryModel.findOneAndDelete({name: name});
        if (!category){
            return new NotFoundException("Category not found.");
        }
        
        return category;
    }

    // --- Function that gets the jwt token bearer's role
    async extractRole(token: string) {
        //console.log(token);
        const temp = atob(token.split('.')[1]);
        const role = temp.split(',')[1].slice(-2).charAt(0)

        return role;
    }

    // --- Function that checks if the user is a given role
    async isAllowed(token: string, expectedRole: string) {
        const role = await this.extractRole(token);
        return role == expectedRole;
    }

}
