import { Body, Controller, Post, Session } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor (private usersService: UsersService) {}
    // --- Super Admin ---
    //TODO: Implement a way of authorizing the user before creation
    @Post()
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.usersService.create(body.name,body.email,body.password);

        return user;
    }

}
