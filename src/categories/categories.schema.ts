import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Category {
    @Prop({ required: [true, "Category must have a name."], unique: true, trim: true })
    name: string;
    
    @Prop({ default: "Default.jpg", trim: true  })
    image: string;

    @Prop({ required: [true, "Category must have a description."], trim: true })
    description: string;
}

export type categoryDocument = HydratedDocument<Category>;

export const categorySchema = SchemaFactory.createForClass(Category);