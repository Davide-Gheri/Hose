import { Injectable } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import * as faker from 'faker';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { FreshOption } from '../../../commands/FreshOption';
import { BaseCommand } from '../../../commands/base.command';

/**
 * Seed database with fake data
 */
@Injectable()
export class BoardSeedCommand extends BaseCommand {
  protected logNamespace = 'BoardSeedCommand';

  constructor(
    @InjectRepository(Board)
    protected readonly repository: Repository<Board>,
    @InjectConnection()
    protected readonly connection: Connection,
  ) {
    super();
  }

  get randomBoard(): Partial<Board> {
    return {
      id: faker.random.alphaNumeric(16),
    };
  }

  @Command({
    command: 'board:seed <number>',
    aliases: 'b:s',
    describe: 'Seed db with fake records',
  })
  async run(
    @Positional({
      name: 'number',
      describe: 'How many boards to seed',
      type: 'number',
      default: 10,
    }) num: number,
    @FreshOption() fresh: boolean,
  ) {
    if (fresh) {
      await this.deleteOldRecords();
    }
    this.logger.debug(`Seeding ${num} boards`);
    const boards = [...(new Array(num)).keys()].map(() => this.randomBoard);

    await this.repository.save(boards);

    this.logger.log('Random Boards seeded');
  }
}
