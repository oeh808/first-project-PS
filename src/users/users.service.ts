import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection) {}

    //TODO: Add error handling

    async create(userID : number,name: string, email: string, password: string) {
        const user = new this.userModel({userID, name, email, password});
    
        return user.save();
    }

    // Get Single User
    async findOne(id: number) {
        const user = await this.userModel.findOne({userID: id});
        if (!user){
            return new NotFoundException("User not found");
        }
        //console.log(user.name);
        return user;
    }

    //FIXME: Use regex to make search more flexible
    find(name: string) {
        return this.userModel.find({name: name});
    }

    //TODO: Edit User
    async update(id: number, attrs: Partial<User>) {
        const user = await this.userModel.findOne({userId: id});

    }

    async reset(id: number, password: string) {
        const user = await this.userModel.findOneAndUpdate({userID: id},{password: password}, {new: true});

        if(!user){
            return new NotFoundException("User not found");
        }

        return user;
    }

    async remove(id: number) {
        const user = await this.userModel.findOneAndDelete({userID: id});

        if(!user){
            return new NotFoundException("User not found");
        }

        return user;
    }
}
