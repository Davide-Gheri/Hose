import { Injectable } from '@nestjs/common';
import { BaseCommand } from '../../../commands/base.command';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Gpio } from '../entities/gpio.entity';
import { Connection, Repository } from 'typeorm';
import { Command } from 'nestjs-command';
import { FreshOption } from '../../../commands/FreshOption';

@Injectable()
export class InstallGpiosCommand extends BaseCommand {
  protected logNamespace = 'InstallGpiosCommand';

  private defaultPins = [10, 12, 17, 27];

  constructor(
    @InjectRepository(Gpio)
    protected readonly repository: Repository<Gpio>,
    @InjectConnection()
    protected readonly connection: Connection,
  ) {
    super();
  }

  @Command({
    command: 'gpio:install',
    aliases: ['g:i'],
    describe: 'Install default gpio pins, 10, 12, 17, 27',
  })
  async run(
    @FreshOption() fresh: boolean,
  ) {
    if (fresh) {
      await this.deleteOldRecords();
    }

    await this.repository.insert(this.defaultPins.map(pin => ({pin})));

    this.logger.log('Default Pins created');
  }

}
