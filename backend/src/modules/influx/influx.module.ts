import { Module } from '@nestjs/common';
import { InfluxService } from './services/influx.service';
import { provideInfluxSchema } from './providers/schema.provider';

@Module({
  providers: [
    provideInfluxSchema(),
    InfluxService,
  ],
  exports: [
    InfluxService,
  ],
})
export class InfluxModule {}
