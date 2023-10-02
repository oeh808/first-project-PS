import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Connection, Model } from 'mongoose';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);
import { UserRoles } from './user-roles.enum';

//TODO: Add error handling ----------------------------------------------------------------------------------------------------------------
@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    // --- CREATE ---
    async create(userID : number,name: string, email: string, password: string, header: string) {
        if (! await this.isAllowed(header)){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        password = salt + '.' + hash.toString('hex');

        const user = new this.userModel({userID, name, email, password});
    
        return user.save();
    }

    // Get Single User
    // --- GET ---
    async findOne(id: number, header: string) {
        if (! await this.isAllowed(header)){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const user = await this.userModel.findOne({userID: id});
        if (!user){
            return new NotFoundException("User not found");
        }

        return user;
    }

    // --- GET ---
    findOneByEmail(email: string){ 
        return this.userModel.findOne({ email: email });
    }

    // --- GET ---
    async find(name: string, offset: number, limit: number, header: string) {
        if (! await this.isAllowed(header)){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        // Error handling for user not found unnecessary here due to returning an array
        return this.userModel.find({ "name" : { $regex: name, $options: 'i' } }).skip(offset).limit(limit);
    }

    // --- UPDATE ---
    // Updates any part of the user except the password
    async update(id: number, attrs: Partial<User>, header: string) {
        if (! await this.isAllowed(header)){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const user = await this.userModel.findOneAndUpdate({userID: id}, {name: attrs.name, email: attrs.email}, {new: true, runValidators: true});

        if (!user){
            return new NotFoundException("User not found");
        }

        return user;

    }

    // --- UPDATE ---
    async reset(id: number, password: string, header: string) {
        if (! await this.isAllowed(header)){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        password = salt + '.' + hash.toString('hex');

        const user = await this.userModel.findOneAndUpdate({userID: id},{password: password}, { new: true, runValidators: true });

        if(!user){
            return new NotFoundException("User not found");
        }

        return user;
    }

    // --- DELETE ---
    async remove(id: number, header: string) {
        if (! await this.isAllowed(header)){
            throw new UnauthorizedException("You do not have permission to do that.");
        }

        const user = await this.userModel.findOneAndDelete({userID: id});

        if(!user){
            return new NotFoundException("User not found");
        }

        return user;
    }

    // --- Function that gets the jwt token bearer's role
    async extractRole(token: string) {
        const temp = atob(token.split('.')[1]);
        const id = temp.split(',')[0].slice(-1);
        const user = await this.userModel.findOne({userID: id});

        return user.role;
    }

    // --- Function that checks if the user is a superadmin given a token
    async isAllowed(token: string) {
        const role = await this.extractRole(token);
        return role == UserRoles.SUPERADMIN;
    }
}
