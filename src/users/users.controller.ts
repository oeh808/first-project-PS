import { Body, Controller, Post, Session, Get, Patch, Delete, Param } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor (private usersService: UsersService) {}
    // --- Super Admin ---
    //FIXME: Implement a way of authorizing the user before creation
    @Post()
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.usersService.create(body.userID,body.name,body.email,body.password);

        return user;
    }

    @Get('/:id')
    getUser(@Param('id') id: string) {
        return this.usersService.findOne(parseInt(id));
    }

    //FIXME: Implement search through email as well
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

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

}
