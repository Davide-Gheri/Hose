import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';
import path from 'path';
import { Logger } from './Logger';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundExceptionFilter } from './filters';
import { NestExpressApplication } from '@nestjs/platform-express';
import Config from 'config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: new Logger(),
  });

  // Add global validations pipe
  app.useGlobalPipes(new ValidationPipe());
  // Add global exception filters
  app.useGlobalFilters(new NotFoundExceptionFilter());
  // Set prefix for all controllers
  app.setGlobalPrefix('api');
  // Set http logging
  app.use(morgan(Config.get('settings.loggerFormat')));
  // Statically serve translations
  app.useStaticAssets(path.join(__dirname, '..', 'i18n'), {
    dotfiles: 'ignore',
    prefix: '/locales',
  });

  // Misc
  app.disable('x-powered-by');

  await app.listen(Config.get('port'));
  Logger.debug(`Server listening on port ${Config.get('port')}`);
}
bootstrap().catch(Logger.log);
