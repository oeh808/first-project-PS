import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './user.schema';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: userSchema}]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService]
})
export class UsersModule {}
