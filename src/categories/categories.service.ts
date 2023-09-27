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
    findOne() {

    }

    find() {

    }

    // --- UPDATE ---
    edit() {

    }

    // --- DELETE ---
    remove() {
        
    }

}
