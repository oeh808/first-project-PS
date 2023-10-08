import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './items.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { UserRoles } from 'src/users/user-roles.enum';
import { Category } from 'src/categories/categories.schema';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateCategoryDto } from 'src/categories/dtos/update-category.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { AddCategoriesDto } from './dtos/add-categories.dto';
import { QueryResult } from 'typeorm';
import { EditItemDto } from './dtos/edit-item.dto';

@Injectable()
export class ItemsService {
    constructor(
        @InjectModel(Item.name) private itemModel: Model<Item>,
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        private categoriesService: CategoriesService
        ) {}

    async create(dto: CreateItemDto) {
        dto.categories = dto.categories.map(s => new mongoose.Types.ObjectId(s));

        const item = new this.itemModel({...dto});

        return item.save();
    }

    async findOne(SKU: number) {
        const item = await this.itemModel.findOne({SKU: SKU}).populate({path: 'categories', model: this.categoryModel});

        if (!item){
            throw new NotFoundException("Item not found.");
        }

        return item;
    }

    async find(categs: any[]) {
        // Assume front end will send the object id for category filtering
        categs = categs.map(s => new mongoose.Types.ObjectId(s));

        const test = await this.itemModel.aggregate([
            // {
            //     $unwind: "$categories"
            // },
            {
                $match: {
                    categories: {
                        $all: categs
                    }
                }
            },
            {
                $sort: {SKU: 1}
            }
            // {
            //     $lookup: {
            //         from: "categories",
            //         foreignField: "_id",
            //         as: ""
            //     }
            // }
        ]);

        await this.itemModel.populate(test,{path: 'categories', model: this.categoryModel});

        return test;

    }

    async update(SKU: number, dto: EditItemDto) {
        const item = await this.itemModel.findOne({SKU: SKU});
        if (!item){
            throw new NotFoundException("Item not found.");
        }
        dto.categories = dto.categories.map(s => new mongoose.Types.ObjectId(s));
        Object.assign(item,dto);
        const res = await this.itemModel.updateOne({SKU: SKU}, item);

        //const item = await this.itemModel.find({SKU: SKU}, {...dto}, { new: true, runValidators: true } );
        

        return item;
    }


    // Only the admin can delete an item
    delete(SKU: number) {
        const item = this.itemModel.findOneAndDelete({SKU: SKU});

        if (!item){
            throw new NotFoundException("Item not found.")
        }

        return item;
    }

    async uploadImage(SKU: number, image: Express.Multer.File) {
        const item = await this.itemModel.findOneAndUpdate({SKU: SKU}, {image: image.filename}, {returnDocument: "after"});

        return item;
    }
}
