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
            // {
            //     $lookup: {
            //         from: "categories",
            //         foreignField: "_id",
            //         as: ""
            //     }
            // }
        ]);

        await this.itemModel.populate(test,{path: 'categories', model: this.categoryModel})

        return test;

    }

    async update(SKU: number, attrs: Partial<Item> , header: string) {
        const role = await this.extractRole(header);
        if( role != UserRoles.ADMIN.toString() && role != UserRoles.EDITOR.toString()){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const item = await this.itemModel.findOneAndUpdate({SKU: SKU}, {name: attrs.name, image: attrs.image, description: attrs.description}, { new: true, runValidators: true } );
        if (!item){
            throw new NotFoundException("Item not found.");
        }

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

    //TODO:
    async addCategories(SKU: number, categs: any, header: string) {
        const role = await this.extractRole(header);
        if( role != UserRoles.ADMIN.toString() && role != UserRoles.EDITOR.toString()){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        let item = await this.itemModel.findOne({SKU: SKU});

        if(!item){
            return new NotFoundException("Item not found.");
        }

        categs = categs.map(s => new mongoose.Types.ObjectId(s));

        // Aggregation to check if the categories being added exist in the categories collection
        const existingCategs: ObjectId[] = await this.categoryModel.aggregate([
            {
                $match: {
                    _id: {
                        $in: categs
                    }
                }
            }
        ])

        // Throws an error if not all the categories meant to be added don't exist
        if(existingCategs.length != categs.length){
            throw new NotFoundException("Not all of these categories exist.");
        }

        item = await this.itemModel.findOneAndUpdate(
            {SKU: SKU},
            {$addToSet: {categories: {$each: categs}}}
        )

        return item;

    }

    //TODO:
    async editCategories(SKU: number, dto: UpdateCategoryDto, header: string) {
        if (!this.isAllowed(header, UserRoles.ADMIN.toString())){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

    }
}
