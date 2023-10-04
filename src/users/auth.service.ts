import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dtos/create-user.dto';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private usersService: UsersService) {}

    async signUp(dto: CreateUserDto, header: string) {
        const user = await this.usersService.create(dto, header);
        const token = await this.jwtService.signAsync({ id: user.userID, role: user.role, name: user.name, email: user.email });
        // console.log(token);

        return [user, token];
    }

    async signIn(email: string, password: string) {
        const user = await this.usersService.findOneByEmail(email).select("+password");
        if (!user){
            return new BadRequestException("Incorrect Email or Password")
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (hash.toString('hex') !== storedHash){
            throw new BadRequestException("Incorrect Email or Password")
        }

        const token = await this.jwtService.signAsync({ id: user.userID, role: user.role, name: user.name, email: user.email });

        return token;
    }
}

// export function extractRole(token: string) {
//     //console.log(token);
//     const temp = atob(token.split('.')[1]);
//     const role = temp.split(',')[1].slice(-2).charAt(0)

//     return role;
// }

// // --- Function that checks if the user is a superadmin given a token
// export async function isAllowed(token: string, expectedRole: string) {
//     const role = await this.extractRole(token);
//     return role == expectedRole;
// }
