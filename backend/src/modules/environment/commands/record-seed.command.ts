import { Injectable } from '@nestjs/common';
import { Command, Option, Positional } from 'nestjs-command';
import { Record } from '../entities/record.entity';
import * as faker from 'faker';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Environment } from '../entities/environment.entity';
import { FreshOption } from '../../../commands/FreshOption';
import { BaseCommand } from '../../../commands/base.command';

@Injectable()
export class RecordSeedCommand extends BaseCommand {
  protected logNamespace = 'RecordSeedCommand';

  constructor(
    @InjectRepository(Record)
    protected readonly repository: Repository<Record>,
    @InjectRepository(Environment)
    private readonly envRepository: Repository<Environment>,
    @InjectConnection()
    protected readonly connection: Connection,
  ) {
    super();
  }

  get randomReading(): number {
    return faker.random.number(800);
  }

  get randomDate(): Date {
    return faker.date.recent();
  }

  get randomRecord(): Partial<Record> {
    return {
      reading: this.randomReading,
      createdAt: this.randomDate,
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
        ...this.randomRecord,
        boardId: env.boardId,
      }));
      await this.repository.insert(records);
    }

    this.logger.log('Random Records seeded');
  }

  private getEnvironments(envIds: string[]) {
    const builder = this.envRepository.createQueryBuilder();
    builder.where('boardId is not null');
    if (envIds.length) {
      this.logger.debug('Filtering environments by ids');
      this.logger.debug(envIds.join(', '));
      builder.andWhereInIds(envIds);
    }
    return builder.getMany();
  }
}
