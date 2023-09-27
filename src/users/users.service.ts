import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';

//TODO: Add error handling and authentication----------------------------------------------------------------------------------------------------------------
@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection) {}

    // --- CREATE ---
    async create(userID : number,name: string, email: string, password: string) {
        const user = new this.userModel({userID, name, email, password});
    
        return user.save();
    }

    // Get Single User
    // --- GET ---
    async findOne(id: number) {
        const user = await this.userModel.findOne({userID: id});
        if (!user){
            return new NotFoundException("User not found");
        }

        return user;
    }

    //FIXME: Implement Pagination
    // --- GET ---
    find(name: string) {
        return this.userModel.find({ "name" : { $regex: name, $options: 'i' } });
    }

    // --- UPDATE ---
    async update(id: number, attrs: Partial<User>) {
        const user = await this.userModel.findOneAndUpdate({userID: id}, {name: attrs.name, email: attrs.email}, {new: true, runValidators: true});

        return user;

    }

    // --- UPDATE ---
    async reset(id: number, password: string) {
        const user = await this.userModel.findOneAndUpdate({userID: id},{password: password}, {new: true});

        if(!user){
            return new NotFoundException("User not found");
        }

        return user;
    }

    // --- DELETE ---
    async remove(id: number) {
        const user = await this.userModel.findOneAndDelete({userID: id});

        if(!user){
            return new NotFoundException("User not found");
        }

        return user;
    }
}
