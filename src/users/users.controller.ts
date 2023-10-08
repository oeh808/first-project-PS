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
    getUser(@Param('id') id: string) {
        try {
            return this.usersService.findOne(parseInt(id));
        }catch(error){
            throw new BadRequestException(error.message);
        }
        
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.SUPER_ADMIN])
    @Get()
    getAllUsers(@Body() body: SearchUserDto) {
        try {
            return this.usersService.find(body);
        }catch(error){
            throw new BadRequestException(error.message);
        }
        
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.SUPER_ADMIN])
    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: EditUserDto) {
        try {
            return this.usersService.update(parseInt(id), body);
        }catch(error){
            throw new BadRequestException(error.message);
        }
        
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.SUPER_ADMIN])
    @Patch('/reset/:id')
    resetUserPassword(@Param('id') id: string, @Body() body: ResetUserPasswordDto) {
        try {
            return this.usersService.reset(parseInt(id),body.password);
        }catch(error){
            throw new BadRequestException(error.message);
        }
        
    }

    @UseGuards(JwtAuthGuard)
    @Roles([UserRoles.SUPER_ADMIN])
    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        try {
            return this.usersService.remove(parseInt(id));
        }catch(error){
            throw new BadRequestException(error.message);
        }
        
    }

}
