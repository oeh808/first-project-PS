import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
    @Prop({ required: [true, "User ID required."], unique: true  })
    userID: number;

    @Prop({ required: [true, "Name required."] })
    name: string;
    
    @Prop({ required: [true, "Email required."], unique: true  })
    email: string;

    @Prop({ required: [true, "Password required."] })
    password: string;
}

export type userDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);