import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
export class User {
    @Prop({ required: [true, "User ID required."], unique: true, trim: true  })
    userID: number;

    @Prop({ required: [true, "Name required."], trim: true })
    name: string;
    
    @Prop({ required: [true, "Email required."], unique: true, trim: true  })
    email: string;

    @Prop({ required: [true, "Password required."], trim: true, select: false})
    password: string;

    // @Prop()
    // items: { type: Types.ObjectId; ref: 'Item' }
}

export type userDocument = HydratedDocument<User>;

export const userSchema = SchemaFactory.createForClass(User);