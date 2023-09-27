import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Category } from './categories.schema';
import { Model } from 'mongoose';


@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

    // --- CREATE ---
    create(name: string, image: string, description: string) {
        const category = new this.categoryModel({name,image,description});

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
    
    //TODO:
    find() {

    }

    // --- UPDATE ---
    async update(name: string, attrs: Partial<Category>) {
        const category = await this.categoryModel.findOneAndUpdate({name: name}, {image: attrs.image, description: attrs.description}, {new: true} );
        if(!category){
            return new NotFoundException("Category not found.");
        }

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
