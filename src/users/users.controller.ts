import { Body, Controller, Post, Session, Get, Patch, Delete } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor (private usersService: UsersService) {}
    // --- Super Admin ---
    //FIXME: Implement a way of authorizing the user before creation
    @Post()
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.usersService.create(body.name,body.email,body.password);

        return user;
    }

    //TODO:
    @Get('/:id')
    getUser() {

    }

    //TODO:
    @Get()
    getAllUsers(@Body() body: CreateUserDto) {
        return this.usersService.find(body.name);
    }

    //TODO:
    @Patch()
    editUser() {

    }

    //TODO:
    @Patch()
    resetUserPassword() {

    }

    //TODO:
    @Delete()
    removeUser() {

    }

}
