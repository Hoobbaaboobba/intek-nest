import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/videos', express.static(join(__dirname, '..', 'videos')));
  await app.listen(3000);
}
bootstrap();
