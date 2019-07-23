import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Rule } from '../entities/rule.entity';
import { Connection, Repository } from 'typeorm';
import { Command } from 'nestjs-command';
import { FreshOption } from '../../../commands/FreshOption';
import { BaseCommand } from '../../../commands/base.command';

@Injectable()
export class InstallRulesCommand extends BaseCommand {
  protected logNamespace = 'InstallRulesCommand';

  private defaultRules: Array<Partial<Rule>> = [
    {
      title: 'Mediterranean',
      minHumidity: 10,
      wateringSeconds: 20,
    },
    {
      title: 'Tropical',
      minHumidity: 15,
      wateringSeconds: 20,
    },
    {
      title: 'Middle east',
      minHumidity: 5,
      wateringSeconds: 10,
    },
  ];

  constructor(
    @InjectRepository(Rule)
    protected readonly repository: Repository<Rule>,
    @InjectConnection()
    protected readonly connection: Connection,
  ) {
    super();
  }

  @Command({
    command: 'rule:install',
    aliases: 'r:i',
    describe: 'Create default rules',
  })
  async run(
    @FreshOption() fresh: boolean,
  ) {
    if (fresh) {
      await this.deleteOldRecords();
    }

    await this.repository.insert(this.defaultRules);

    this.logger.log('Default rules created');
  }
}
