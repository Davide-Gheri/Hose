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
import { Record } from './entities/record.entity';
import { GpioModule } from '../gpio/gpio.module';
import { Gpio } from '../gpio/entities/gpio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Environment, Rule, Record, Gpio]),
    CommandModule,
    GpioModule,
  ],
  providers: [
    InstallEnvironmentCommand,
    RecordSeedCommand,
    EnvironmentService,
  ],
  controllers: [
    EnvironmentController,
    EnvironmentRecordController,
    RecordController,
  ],
  exports: [
    InstallEnvironmentCommand,
    RecordSeedCommand,
    EnvironmentService,
  ],
})
export class EnvironmentModule {}
