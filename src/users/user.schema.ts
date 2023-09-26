import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;
}

export type userDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);