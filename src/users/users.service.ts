import { Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Connection, Model } from 'mongoose';
import { SearchUserDto } from './dtos/search-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/update-user.dto';
import { AuthService } from './auth.service';

//TODO: Add error handling ----------------------------------------------------------------------------------------------------------------
@Injectable()
export class UsersService {
    
    constructor(@InjectModel(User.name) private userModel: Model<User>, @Inject(forwardRef(() => AuthService)) private authService: AuthService) {}

    // --- CREATE ---
    async create(dto: CreateUserDto) {
        const [hashedPass, token] = await this.authService.signUp(dto);
        dto.password = hashedPass;

        const user = new this.userModel({...dto});
        await user.save();
    
        return token;
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
    findOneByEmail(email: string){ 
        return this.userModel.findOne({ email: email });
    }

    // --- GET ---
    async find(dto: SearchUserDto) {

        // Error handling for user not found unnecessary here due to returning an array
        const queryOptions = {
            name : "",
            email : ""
        }

        Object.assign(queryOptions, dto)
        //console.log(queryOptions);

        // Filters the search by name and email
        const query = this.userModel.find({ "name" : { $regex: queryOptions.name, $options: 'i' }, "email" :  { $regex: queryOptions.email, $options: 'i' }});

        // Use offset if applicable
        if(dto.offset){
            query.skip(dto.offset);
        }

        // Use limit if applicable
        if(dto.limit){
            query.limit(dto.limit);
        }


        const res = await query;
        return res;
    }

    // --- UPDATE ---
    // Updates any part of the user except the password
    async update(id: number, attrs: Partial<EditUserDto>) {
        const user = await this.userModel.findOneAndUpdate({userID: id}, {...attrs}, {new: true, runValidators: true});

        if (!user){
            return new NotFoundException("User not found");
        }

        return user;

    }

    // --- UPDATE ---
    async reset(id: number, password: string) {
        password = await this.authService.hashPassword(password);

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

    // // --- Function that gets the jwt token bearer's role
    // async extractRole(token: string) {
    //     //console.log(token);
    //     const temp = atob(token.split('.')[1]);
    //     const role = temp.split(',')[1].split(':')[1];
    //     //console.log(temp);

    //     return role;
    // }

    // // --- Function that checks if the user is a superadmin given a token
    // async isAllowed(token: string) {
        
    //     const role = await this.extractRole(token);
    //     return role == ('"' + UserRoles.SUPER_ADMIN.toString() + '"');
    // }
}
