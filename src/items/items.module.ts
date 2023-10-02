import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, itemSchema } from './items.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Item.name, schema: itemSchema}])],
  controllers: [ItemsController],
  providers: [ItemsService]
})
export class ItemsModule {}
