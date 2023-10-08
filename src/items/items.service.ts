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

    async create(dto: CreateItemDto,  header: string) {
        dto.categories = dto.categories.map(s => new mongoose.Types.ObjectId(s));
        
        const role = await this.extractRole(header);
        if( role != UserRoles.ADMIN.toString() && role != UserRoles.EDITOR.toString()){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const item = new this.itemModel({...dto});

        return item.save();
    }

    async findOne(SKU: number, header: string) {
        const role = await this.extractRole(header);
        if( role != UserRoles.ADMIN.toString() && role != UserRoles.EDITOR.toString()){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const item = await this.itemModel.findOne({SKU: SKU}).populate({path: 'categories', model: this.categoryModel});

        if (!item){
            throw new NotFoundException("Item not found.");
        }

        return item;
    }

    async find(categs: any[], header: string) {
        // Assume front end will send the object id for category filtering
        const role = await this.extractRole(header);
        if( role != UserRoles.ADMIN.toString() && role != UserRoles.EDITOR.toString()){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

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

    async update(SKU: number, dto: EditItemDto , header: string) {
        const role = await this.extractRole(header);
        if( role != UserRoles.ADMIN.toString() && role != UserRoles.EDITOR.toString()){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

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
    delete(SKU: number, header: string) {
        if (!this.isAllowed(header, UserRoles.ADMIN.toString())){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const item = this.itemModel.findOneAndDelete({SKU: SKU});

        if (!item){
            throw new NotFoundException("Item not found.")
        }

        return item;
    }

    async uploadImage(SKU: number, image: Express.Multer.File, header: string) {
        const role = await this.extractRole(header);
        if( role != UserRoles.ADMIN.toString() && role != UserRoles.EDITOR.toString()){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const item = await this.itemModel.findOneAndUpdate({SKU: SKU}, {image: image.filename}, {returnDocument: "after"});

        return item;
    }

    async extractRole(token: string) {
        const temp = atob(token.split('.')[1]);
        const role = temp.split(',')[1].split(':')[1];

        return role;
    }

    // --- Function that checks if the user is a given role
    async isAllowed(token: string, expectedRole: string) {
        const role = await this.extractRole(token);
        return role == ('"' + expectedRole.toString() + '"');
    }
}
