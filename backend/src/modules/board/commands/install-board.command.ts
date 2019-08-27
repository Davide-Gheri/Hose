import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Board } from '../entities/board.entity';
import { Connection, Repository } from 'typeorm';
import { FreshOption } from '../../../commands/FreshOption';
import { BaseCommand } from '../../../commands/base.command';

/**
 * Create a fake example board
 */
@Injectable()
export class InstallBoardCommand extends BaseCommand {
  protected logNamespace = 'InstallBoardCommand';

  private defaultboard: Partial<Board> = {
    id: 'exampleId123',
  };

  constructor(
    @InjectRepository(Board)
    protected readonly repository: Repository<Board>,
    @InjectConnection()
    protected readonly connection: Connection,
  ) {
    super();
  }

  @Command({
    command: 'board:install',
    aliases: 'b:i',
    describe: 'Create example board',
  })
  async run(
    @FreshOption() fresh: boolean,
  ) {
    if (fresh) {
      await this.deleteOldRecords();
    }
    await this.repository.save(this.defaultboard);

    this.logger.log('Example board created');
  }
}
