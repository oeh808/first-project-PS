import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection) {}

    create(createUserDto: CreateUserDto) {
        const user = new this.userModel(createUserDto);
    
        return user.save();
    }
}
