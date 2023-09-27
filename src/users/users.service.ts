import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

//TODO: Add error handling and authentication----------------------------------------------------------------------------------------------------------------
@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    // --- CREATE ---
    async create(userID : number,name: string, email: string, password: string) {
        //TODO: Move password encryption to a middle ware so it can be applied on reset password as well

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

    // --- GET ---
    find(name: string, offset: number, limit: number) {
        // Error handling for user not found unnecessary here due to returning an array
        return this.userModel.find({ "name" : { $regex: name, $options: 'i' } }).skip(offset).limit(limit);
    }

    // --- UPDATE ---
    async update(id: number, attrs: Partial<User>) {
        const user = await this.userModel.findOneAndUpdate({userID: id}, {name: attrs.name, email: attrs.email}, {new: true, runValidators: true});

        if (!user){
            return new NotFoundException("User not found");
        }

        return user;

    }

    // --- UPDATE ---
    //TODO: Implement password hashing
    async reset(id: number, password: string) {
        const user = await this.userModel.findOneAndUpdate({userID: id},{password: password}, { new: true, runValidators: true });

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
