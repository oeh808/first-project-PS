import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, categorySchema } from './categories.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: Category.name, schema: categorySchema}]),],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
