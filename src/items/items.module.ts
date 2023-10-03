import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, itemSchema } from './items.schema';
import { Category, categorySchema } from 'src/categories/categories.schema';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Item.name, schema: itemSchema}]), MongooseModule.forFeature([{name: Category.name, schema: categorySchema}])],
  controllers: [ItemsController],
  providers: [ItemsService, CategoriesService] 
})
export class ItemsModule {}
