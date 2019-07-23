import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommandModule, CommandService } from 'nestjs-command';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.select(CommandModule).get(CommandService).exec();
})();
