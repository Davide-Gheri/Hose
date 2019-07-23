import { HttpModule, Module } from '@nestjs/common';
import { GpioService } from './services/gpio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gpio } from './entities/gpio.entity';
import { CommandModule } from 'nestjs-command';
import { InstallGpiosCommand } from './commands/install-gpios.command';
import { ManagerService } from './services/manager.service';
import { GpioController } from './controllers/gpio.controller';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Gpio]),
    CommandModule,
  ],
  providers: [
    GpioService,
    ManagerService,
    InstallGpiosCommand,
  ],
  exports: [
    GpioService,
    InstallGpiosCommand,
  ],
  controllers: [GpioController],
})
export class GpioModule {}
