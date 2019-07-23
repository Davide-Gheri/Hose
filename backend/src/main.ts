import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Config from 'config';
import morgan from 'morgan';
import { Logger } from './Logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new Logger(),
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use(morgan(Config.get('settings.loggerFormat')));

  await app.listen(Config.get('port'));
  Logger.debug(`Server listening on port ${Config.get('port')}`);
}
bootstrap();
