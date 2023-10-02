import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema()
export class Item {
    // SKU stands for “stock keeping unit”
    @Prop({ required: [true, "Item must have an SKU."], unique: true, trim: true  })
    SKU: number;

    @Prop({ required: [true, "Item must have a name."], trim: true })
    name: string;
    
    @Prop({ required: [true, "Item must have an image"], trim: true  })
    image: string;

    @Prop({ required: [true, "Item must have a description."], trim: true })
    description: string;

    @Prop()
    categories: [
        {
            type: mongoose.Types.ObjectId,
            ref: "categories"
        }
    ]
    //categories: {type: mongoose.Schema.Types.ObjectId[], ref: "categories"}
}

export type itemDocument = HydratedDocument<Item>;

export const itemSchema = SchemaFactory.createForClass(Item);