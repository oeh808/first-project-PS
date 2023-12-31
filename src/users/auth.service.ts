import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRoles } from './user-roles.enum';
import { ConfigService } from '@nestjs/config';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, @Inject(forwardRef(() => UsersService)) private usersService: UsersService, private configService: ConfigService) {}

    async signUp(dto: CreateUserDto) {
        //const user = await this.usersService.create(dto, header);
        dto.password = await this.hashPassword(dto.password);
        const token = await this.jwtService.signAsync({role: UserRoles.EDITOR , ...dto});
        // console.log(token);

        return [dto.password, token];
    }

    async signIn(email: string, password: string) {
        const user = await this.usersService.findOneByEmail(email).select("+password");
        if (!user){
            return new UnauthorizedException("Incorrect Email or Password")
        }

        // Decrypting password
        //const [salt, storedHash] = user.password.split('.');
        const salt = this.configService.get<string>("SALT");
        const storedHash = user.password;
        
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Comparing password entered by user with stored password
        if (hash.toString('hex') !== storedHash){
            throw new UnauthorizedException("Incorrect Email or Password")
        }

        const token = await this.jwtService.signAsync({role: user.role, userID: user.userID, name: user.name, email: user.email, password: user.password});

        return token;
    }

    async hashPassword(password: string){
        // const salt = randomBytes(8).toString('hex');
        const salt = this.configService.get<string>("SALT");
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        //password = salt + '.' + hash.toString('hex');
        return hash.toString('hex');
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
