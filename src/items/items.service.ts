import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './items.schema';
import mongoose, { Aggregate, Model, PipelineStage } from 'mongoose';
import { Category } from 'src/categories/categories.schema';
import { CreateItemDto } from './dtos/create-item.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { EditItemDto } from './dtos/edit-item.dto';
import { SearchItemDto } from './dtos/search-item.dto';

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

    async find(dto: SearchItemDto) {
        const queryOptions = {
            name : "",
            description : ""
        }
        Object.assign(queryOptions, dto)

        // Always filters by name and description (Default being inclusive regex on the empty string)
        const stages: PipelineStage[] = [
            {
                $match: {
                    name: { 
                        $regex: queryOptions.name, $options: 'i' 
                    },
                    description: {
                        $regex: queryOptions.description, $options: 'i' 
                    }
                }
            }
        ]

        // Filters by categories if categories are given
        if(dto.categories){
            const categs = dto.categories.map(s => new mongoose.Types.ObjectId(s));
            stages.push(
                {
                    $match: {
                        categories: {
                            $all: categs
                        },
                    }
                }
            )
        }

        // Sort by SKU (Ascending)
        stages.push(
            {
                $sort: {SKU: 1}
            }
        )

        // Apply offset to aggregation if offset is given
        if (dto.offset){
            stages.push(
                {
                    $skip: dto.offset
                }
            )
        }

        // Apply limit to aggregation if limit is given
        if (dto.limit){
            stages.push(
                {
                    $limit: dto.limit
                }
            )
        }

        const res = this.itemModel.aggregate(stages);
        await this.itemModel.populate(res,{path: 'categories', model: this.categoryModel});

        return res;

        // res = await this.itemModel.aggregate([
            //     {
            //         $match: {
            //             categories: {
            //                 $all: categs
            //             },
            //             name: { 
            //                 $regex: queryOptions.name, $options: 'i' 
            //             },
            //             description: {
            //                 $regex: queryOptions.description, $options: 'i' 
            //             }
            //         }
            //     },
            //     {
            //         $skip: queryOptions.offset 
            //     },
            //     {
            //         $sort: {SKU: 1}
            //     }
            // ]);

    }

    async update(SKU: number, dto: EditItemDto) {
        const item = await this.itemModel.findOne({SKU: SKU});
        if (!item){
            throw new NotFoundException("Item not found.");
        }

        if(dto.categories){
            dto.categories = dto.categories.map(s => new mongoose.Types.ObjectId(s));
        }

        Object.assign(item,dto);
        await this.itemModel.updateOne({SKU: SKU}, item);

        //const item = await this.itemModel.find({SKU: SKU}, {...dto}, { new: true, runValidators: true } );
        

        return item;
    }


    // Only the admin can delete an item
    async delete(SKU: number) {
        const item = await this.itemModel.findOneAndDelete({SKU: SKU});
        
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
