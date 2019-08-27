import { Injectable } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import Config from 'config';
import { InjectRepository } from '@nestjs/typeorm';
import { Environment } from '../entities/environment.entity';
import { Repository } from 'typeorm';
import { Logger } from '../../../Logger';
import { Watering } from '../entities/watering.entity';
import { GpioService } from '../../gpio/services/gpio.service';

@Injectable()
export class ScheduleService extends NestSchedule {
  private logger: Logger = new Logger('ScheduleService');

  constructor(
    @InjectRepository(Environment)
    private readonly repository: Repository<Environment>,
    @InjectRepository(Watering)
    private readonly wateringRepository: Repository<Watering>,
    private readonly gpioService: GpioService,
  ) {
    super();
  }

  @Cron(Config.get('watering.cron'))
  async runWatering() {
    this.logger.log('Running watering cron');
    const waterings = await this.getWatering();

    if (waterings.length === 0) {
      this.logger.log('No scheduled watering');
      return;
    }

    const wateringPromises = waterings.map(watering => this.waterEnvironment(watering));

    Promise.all(wateringPromises).then(() => this.logger.log('All watering completed'));
  }

  getWatering() {
    return this.wateringRepository
      .find({
        relations: ['environment'],
        where: {processedAt: null},
      });
  }

  async waterEnvironment(watering: Watering) {
    this.logger.debug(`Processing scheduled watering for env ${watering.environment.title} on pin(s) ${
      watering.environment.gpios.map(g => g.pin).join(', ')
    }`);
    return this.gpioService.exec(watering.environment)
      .then(() => {
        watering.processedAt = new Date();
        return this.wateringRepository.save(watering);
      });
  }
}
