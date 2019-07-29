import { BadRequestException, Injectable } from '@nestjs/common';
import { Environment } from '../../environment/entities/environment.entity';
import { sleep } from '../../../lib';
import { ManagerService } from './manager.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Gpio } from '../entities/gpio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GpioService {
  constructor(
    @InjectRepository(Gpio)
    private readonly repository: Repository<Gpio>,
    private readonly manager: ManagerService,
  ) {}

  async ensureUnique(pin: number) {
    const existing = await this.repository.createQueryBuilder()
      .where('pin = :pin', {pin})
      .getOne();

    if (existing) {
      throw new BadRequestException(`Gpio with pin ${pin} already exists`);
    }
  }

  async ensureGpio(pin: number) {
    const existing = await this.repository.createQueryBuilder()
      .where('pin = :pin', {pin})
      .getOne();

    if (existing) {
      return existing;
    }
    // TODO validate pin range
    return this.repository.save({pin});
  }

  async exec(environment: Environment) {
    if (!environment.gpios) {
      return;
    }
    for (const gpio of environment.gpios) {
      await this.manager.sendOn(gpio.pin)
        .then(() => {
          sleep(environment.rule.wateringSeconds * 1000)
            .then(() => this.manager.sendOff(gpio.pin));
        });
    }
  }
}
