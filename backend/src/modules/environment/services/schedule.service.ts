import { Injectable } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import Config from 'config';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Environment } from '../entities/environment.entity';
import { Connection, Repository } from 'typeorm';
import { Logger } from '../../../Logger';
import { Watering } from '../entities/watering.entity';

@Injectable()
export class ScheduleService extends NestSchedule {
  private logger: Logger = new Logger('ScheduleService');

  constructor(
    @InjectRepository(Environment)
    private readonly repository: Repository<Environment>,
    @InjectRepository(Watering)
    private readonly wateringRepository: Repository<Watering>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {
    super();
  }

  @Cron(Config.get('watering.cron'))
  async runWatering() {
    this.logger.debug('Running watering cron');
    const environments = await this.getEnvironments();
    if (environments.length === 0) {
      this.logger.debug('No environments found', 'ScheduleService');
      return;
    }
    const waterings = await this.getWatering(environments);

    console.log(waterings);

    for (const watering of waterings) {
      watering.processedAt = new Date();
      await this.wateringRepository.save(watering);
    }
  }

  getEnvironments() {
    return this.repository.createQueryBuilder('environments')
      .getMany();
  }

  getWatering(envs: Environment[]) {
    return this.wateringRepository.createQueryBuilder()
      .where('environmentId in (:...envIds)', {envIds: envs.map(e => e.id)})
      .andWhere('processedAt is null')
      .getMany();
  }
}
