import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { SearchUserDto } from './dtos/search-user.dto';
import { EditUserDto } from './dtos/update-user.dto';
import { ResetUserPasswordDto } from './dtos/reset-password.dto';

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
    getAllUsers(@Body() body: SearchUserDto) {
        return this.usersService.find(body.name,body.offset,body.limit);
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: EditUserDto) {
        return this.usersService.update(parseInt(id), body);
    }

    //FIXME: Create UpdateUserDTO needed
    @Patch('/reset/:id')
    resetUserPassword(@Param('id') id: string, @Body() body: ResetUserPasswordDto) {
        return this.usersService.reset(parseInt(id),body.password);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

}
