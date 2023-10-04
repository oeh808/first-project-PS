import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ExpressMongoSanitize = require('express-mongo-sanitize');
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(ExpressMongoSanitize());
  app.use(cookieParser());
  await app.listen(3000);
  // Makes a console log of the url being used by the nest app
  //console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
