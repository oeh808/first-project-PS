import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

    // TODO: Set a type for categories
    @Prop()
    categories: any[];
}

export type itemDocument = HydratedDocument<Item>;

export const itemSchema = SchemaFactory.createForClass(Item);