import { HttpModule, Module } from '@nestjs/common';
import { GpioService } from './services/gpio.service';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [GpioService],
  exports: [GpioService],
})
export class GpioModule {}
