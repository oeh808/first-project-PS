import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query, UseGuards, Headers, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { SearchUserDto } from './dtos/search-user.dto';
import { EditUserDto } from './dtos/update-user.dto';
import { ResetUserPasswordDto } from './dtos/reset-password.dto';
import { Jwt } from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor (private usersService: UsersService, private authService: AuthService) {}
    // --- Super Admin ---
    @UseGuards(JwtAuthGuard)
    @Post()
    async createUser(@Body() body: CreateUserDto, @Headers('authorization') header: string) { 
        try {
            return await this.authService.signUp(body, header);
        }catch(error){
            throw new BadRequestException(`User with ID: ${body.userID} already exists.`);
        }
        
    }

    @Post('/signin')
    async signIn(@Body() body: LoginUserDto) {
        const user = await this.authService.signIn(body.email, body.password);

        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    getUser(@Param('id') id: string, @Headers('authorization') header: string) {
        return this.usersService.findOne(parseInt(id), header);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllUsers(@Body() body: SearchUserDto, @Headers('authorization') header: string) {
        return this.usersService.find(body, header);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: EditUserDto, @Headers('authorization') header: string) {
        return this.usersService.update(parseInt(id), body, header);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/reset/:id')
    resetUserPassword(@Param('id') id: string, @Body() body: ResetUserPasswordDto, @Headers('authorization') header: string) {
        return this.usersService.reset(parseInt(id),body.password, header);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    removeUser(@Param('id') id: string, @Headers('authorization') header: string) {
        return this.usersService.remove(parseInt(id), header);
    }

}
