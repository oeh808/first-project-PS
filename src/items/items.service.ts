import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './items.schema';
import { Model } from 'mongoose';
import { UserRoles } from 'src/users/user-roles.enum';

@Injectable()
export class ItemsService {
    constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

    async create(sku: number, name: string, image: string, description: string, categories: string[],  header: string) {
        const role = await this.extractRole(header);
        //console.log(UserRoles.EDITOR.toString());
        if( role != UserRoles.ADMIN.toString() && role != UserRoles.EDITOR.toString()){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const item = new this.itemModel({SKU: sku, name: name, image: image, description: description, categories: categories});

        return item.save();
    }

    async findOne(SKU: number, header: string) {
        const role = await this.extractRole(header);
        if( role != UserRoles.ADMIN.toString() && role != UserRoles.EDITOR.toString()){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const item = await this.itemModel.findOne({SKU: SKU});

        if (!item){
            throw new NotFoundException("Item not found.");
        }

        return item;
    }

    async find(categories: string[], header: string) {
        const role = await this.extractRole(header);
        if( role != UserRoles.ADMIN.toString() && role != UserRoles.EDITOR.toString()){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        // const items = await this.itemModel.find({
        //     categories: {$elemMatch: {categories}}
        // }).populate({
        //     path: categories,
        //     select: "" 
        // });

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
}
