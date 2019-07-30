import { Module } from '@nestjs/common';
import { EnvironmentController } from './controllers/environment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from './entities/environment.entity';
import { Rule } from '../rule/entities/rule.entity';
import { CommandModule } from 'nestjs-command';
import { InstallEnvironmentCommand } from './commands/install-environment.command';
import { EnvironmentService } from './services/environment.service';
import { EnvironmentRecordController } from './controllers/environment-record.controller';
import { RecordController } from './controllers/record.controller';
import { RecordSeedCommand } from './commands/record-seed.command';
import { GpioModule } from '../gpio/gpio.module';
import { Gpio } from '../gpio/entities/gpio.entity';
import { InfluxModule } from '../influx/influx.module';
import { ScheduleService } from './services/schedule.service';
import { ScheduleModule } from 'nest-schedule';
import { Watering } from './entities/watering.entity';
import { EnvironmentWateringController } from './controllers/environment-watering.controller';

@Module({
  imports: [
    ScheduleModule.register(),
    TypeOrmModule.forFeature([Environment, Rule, Gpio, Watering]),
    CommandModule,
    GpioModule,
    InfluxModule,
  ],
  providers: [
    InstallEnvironmentCommand,
    RecordSeedCommand,
    EnvironmentService,
    ScheduleService,
  ],
  controllers: [
    EnvironmentController,
    EnvironmentRecordController,
    RecordController,
    EnvironmentWateringController,
  ],
  exports: [
    InstallEnvironmentCommand,
    RecordSeedCommand,
    EnvironmentService,
  ],
})
export class EnvironmentModule {}
