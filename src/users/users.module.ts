import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './user.schema';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: userSchema}]), AuthModule, 
  JwtModule.registerAsync({
    global: true,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
    inject: [ConfigService],
  }),],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtStrategy]
})
export class UsersModule {}
