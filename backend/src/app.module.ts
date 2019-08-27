import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { ScheduleModule } from 'nest-schedule';
import Config from 'config';
import { EnvironmentModule } from './modules/environment/environment.module';
import { RuleModule } from './modules/rule/rule.module';
import { InstallCommand } from './commands/install.command';
import { GpioModule } from './modules/gpio/gpio.module';
import { InfluxModule } from './modules/influx/influx.module';
import { BoardModule } from './modules/board/board.module';
import { ThemeModule } from './modules/theme/theme.module';
import { NotificationModule } from './modules/notification/notification.module';

const databaseDefaults = {
  type: 'sqlite',
  dropSchema: false,
  synchronize: false,
  logging: 'all',
  logger: 'advanced-console',
};

const databaseOptions: any = {
  ...databaseDefaults,
  ...Config.get('database'),
};
// Force database entities resolution
databaseOptions.entities = [__dirname + '/**/*.entity{.ts,.js}'];

@Module({
  imports: [
    ScheduleModule.register(),
    TypeOrmModule.forRoot(databaseOptions),
    CommandModule,
    EnvironmentModule,
    RuleModule,
    GpioModule,
    InfluxModule,
    BoardModule,
    ThemeModule,
    NotificationModule,
  ],
  providers: [
    InstallCommand,
  ],
})
export class AppModule {}
