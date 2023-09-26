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
    findOne(id: number) {
        const user = this.userModel.findOne({userID: id});

        return user;
    }

    //FIXME: Use regex to make search more flexible
    find(name: string) {
        return this.userModel.find({name: name});
    }

    //TODO: Edit User
    update() {

    }

    reset(id: number, password: string) {
        const user = this.userModel.findOneAndUpdate({userID: id},{password: password}, {new: true});

        return user;
    }

    remove(id: number) {
        const user = this.userModel.findOneAndDelete({userID: id});

        return user;
    }
}
