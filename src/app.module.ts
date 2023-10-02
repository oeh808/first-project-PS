import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { CategoriesModule } from './categories/categories.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from './users/jwt-auth.guard';
import 'reflect-metadata';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    UsersModule, 
    CategoriesModule,  
    ItemsModule, 
    MongooseModule.forRootAsync({
      inject: [ConfigService],  
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('DB_URI'),
          dbName: config.get<string>('DB_NAME')
        }
      }
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Globaly scoped validation pipe
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true
      })
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
