import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { CategoriesModule } from './categories/categories.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService} from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.mongo`
    }),
    UsersModule, 
    CategoriesModule, 
    ItemsModule, 
    MongooseModule.forRootAsync({
      inject: [ConfigService],  
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('DB_URI'),
        }
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
