import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private usersService: UsersService) {}

    async signUp(userID: number, name: string, email: string, password: string) {
        const user = await this.usersService.create(userID, name, email, password);
        const token = await this.jwtService.signAsync({ id: user.userID });
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

        const token = await this.jwtService.signAsync({ id: user.userID });

        return token;
    }
}
