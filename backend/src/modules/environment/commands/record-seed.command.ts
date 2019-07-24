import { Injectable } from '@nestjs/common';
import { Command, Option, Positional } from 'nestjs-command';
import { Record } from '../entities/record';
import * as faker from 'faker';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Environment } from '../entities/environment.entity';
import { FreshOption } from '../../../commands/FreshOption';
import { BaseCommand } from '../../../commands/base.command';
import { InfluxService } from '../../influx/services/influx.service';
import Config from 'config';

@Injectable()
export class RecordSeedCommand extends BaseCommand {
  protected logNamespace = 'RecordSeedCommand';

  constructor(
    @InjectRepository(Environment)
    protected readonly repository: Repository<Environment>,
    @InjectConnection()
    protected readonly connection: Connection,
    private readonly influx: InfluxService,
  ) {
    super();
  }

  get randomReading(): number {
    return faker.random.number(800);
  }

  get randomRecord(): Partial<Record> {
    return {
      reading: this.randomReading,
    };
  }

  @Command({
    command: 'record:seed',
    aliases: 're:s',
    describe: 'Seed db with fake records',
  })
  async run(
    @Positional({
      name: 'number',
      describe: 'How many records to seed',
      type: 'number',
      default: 10,
    }) num: number,
    @Option({
      name: 'e',
      alias: 'environment',
      describe: 'Environment ids to seed, default all',
      type: 'array',
      default: [],
    }) envIds: string[],
    @FreshOption() fresh: boolean,
  ) {
    if (fresh) {
      await this.deleteOldRecords();
    }

    const environments = await this.getEnvironments(envIds);
    if (!environments.length) {
      this.logger.log('No Environments to seed');
      return;
    }
    this.logger.debug(`Seeding ${num} Records for ${environments.length} Environments`);

    for (const env of environments) {
      const records = [...(new Array(num)).keys()].map(() => ({
        measurement: Config.get<string>('influx.schema.table'),
        fields: {
          record: this.randomRecord.reading,
        },
        tags: {
          boardId: env.boardId,
        },
      }));
      await this.influx.insert(records);
    }

    this.logger.log('Random Records seeded');
  }

  private getEnvironments(envIds: string[]) {
    const builder = this.repository.createQueryBuilder();
    builder.where('boardId is not null');
    if (envIds.length) {
      this.logger.debug('Filtering environments by ids');
      this.logger.debug(envIds.join(', '));
      builder.andWhereInIds(envIds);
    }
    return builder.getMany();
  }
}
