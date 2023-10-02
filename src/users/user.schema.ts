import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRoles } from './user-roles.enum';

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

    @Prop({type: String, enum: UserRoles, default: UserRoles.EDITOR})
    role: UserRoles;

    // --- Child Reference --- 
    // @Prop()
    // items: { type: Types.ObjectId; ref: 'Item' }

    // --- Populating (Use on queries in respective service /// Alternatively can be placed as middleware) --- 
    // const user = await user.findById(id).populate({
    //     path: 'guides',
    //     select: '-description' // Removes variable from showing up in population
    // });
}

export type userDocument = HydratedDocument<User>;

export const userSchema = SchemaFactory.createForClass(User);