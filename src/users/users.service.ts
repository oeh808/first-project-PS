import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection) {}

    async create(userID : number,name: string, email: string, password: string) {
        const user = new this.userModel({userID, name, email, password});
    
        return user.save();
    }

    //TODO: Get Single User
    findOne(id: number) {
        return this.userModel.find();
    }

    //TODO: Get all Users
    find(name: string) {
        return this.userModel.find({name: name});
    }

    //TODO: Edit User
    update() {

    }

    //TODO: Reset User Password
    reset() {

    }

    //TODO: Delete User
    remove() {

    }
}
