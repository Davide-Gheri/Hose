import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentModule } from './modules/environment/environment.module';
import { RuleModule } from './modules/rule/rule.module';
import { CommandModule } from 'nestjs-command';
import { InstallCommand } from './commands/install.command';
import { GpioModule } from './modules/gpio/gpio.module';
import { InfluxModule } from './modules/influx/influx.module';
import { BoardModule } from './modules/board/board.module';
import Config from 'config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: Config.get('database.database'),
      dropSchema: Config.get('database.dropSchema') || false,
      synchronize: Config.get('database.synchronize') || false,
      logging: 'all',
      logger: 'advanced-console',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    CommandModule,
    EnvironmentModule,
    RuleModule,
    GpioModule,
    InfluxModule,
    BoardModule,
  ],
  controllers: [AppController],
  providers: [
    InstallCommand,
    AppService,
  ],
})
export class AppModule {}
