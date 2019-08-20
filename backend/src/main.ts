import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Config from 'config';
import morgan from 'morgan';
import path from 'path';
import { Logger } from './Logger';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundExceptionFilter } from './filters';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: new Logger(),
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new NotFoundExceptionFilter());

  app.use(morgan(Config.get('settings.loggerFormat')));

  app.useStaticAssets(path.join(__dirname, '..', 'i18n'), {
    dotfiles: 'ignore',
    prefix: '/locales',
  });

  await app.listen(Config.get('port'));
  Logger.debug(`Server listening on port ${Config.get('port')}`);
}
bootstrap();
