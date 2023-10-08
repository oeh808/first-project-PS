import { Body, Controller, Post, Session, Get, Patch, Delete, Param, Query, UseGuards, Headers, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { SearchUserDto } from './dtos/search-user.dto';
import { EditUserDto } from './dtos/update-user.dto';
import { ResetUserPasswordDto } from './dtos/reset-password.dto';
import { Jwt } from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../decorators/role.decorator';
import { UserRoles } from './user-roles.enum';

@Controller('users')
export class UsersController {
    constructor (private usersService: UsersService, private authService: AuthService) {}
    // --- Super Admin ---
    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.SUPER_ADMIN])
    @Post()
    async createUser(@Body() body: CreateUserDto) { 
        try {
            return await this.usersService.create(body);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @Post('/signin')
    async signIn(@Body() body: LoginUserDto) {
        try {
            const user = await this.authService.signIn(body.email, body.password);
            return user;
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.SUPER_ADMIN])
    @Get('/:id')
    async getUser(@Param('id') id: string) {
        try {
            return await this.usersService.findOne(parseInt(id));
        }catch(error){
            throw new BadRequestException(error.message);
        }
        
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.SUPER_ADMIN])
    @Get()
    async getAllUsers(@Body() body: SearchUserDto) {
        try {
            return await this.usersService.find(body);
        }catch(error){
            throw new BadRequestException(error.message);
        }
        
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.SUPER_ADMIN])
    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: EditUserDto) {
        try {
            return await this.usersService.update(parseInt(id), body);
        }catch(error){
            throw new BadRequestException(error.message);
        }
        
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.SUPER_ADMIN])
    @Patch('/reset/:id')
    async resetUserPassword(@Param('id') id: string, @Body() body: ResetUserPasswordDto) {
        try {
            return await this.usersService.reset(parseInt(id),body.password);
        }catch(error){
            throw new BadRequestException(error.message);
        }
        
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.SUPER_ADMIN])
    @Delete('/:id')
    async removeUser(@Param('id') id: string) {
        try {
            return await this.usersService.remove(parseInt(id));
        }catch(error){
            throw new BadRequestException(error.message);
        }
        
    }

}
