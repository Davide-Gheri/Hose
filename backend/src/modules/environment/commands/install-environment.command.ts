import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Environment } from '../entities/environment.entity';
import { Connection, Repository } from 'typeorm';
import { Rule } from '../../rule/entities/rule.entity';
import { FreshOption } from '../../../commands/FreshOption';
import { BaseCommand } from '../../../commands/base.command';

@Injectable()
export class InstallEnvironmentCommand extends BaseCommand {
  protected logNamespace = 'InstallEnvironmentCommand';

  private defaultEnvironment: Partial<Environment> = {
    title: 'My environment',
    description: 'This is an example environment, you can edit or delete it',
    boardId: 'exampleId123',
  };

  constructor(
    @InjectRepository(Environment)
    protected readonly repository: Repository<Environment>,
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
    @InjectConnection()
    protected readonly connection: Connection,
  ) {
    super();
  }

  @Command({
    command: 'environment:install',
    aliases: 'e:i',
    describe: 'Create example environment',
  })
  async run(
    @FreshOption() fresh: boolean,
  ) {
    if (fresh) {
      await this.deleteOldRecords();
    }

    const rule = await this.ruleRepository.createQueryBuilder()
      .limit(1)
      .getOne();

    if (rule) {
      this.logger.debug('Found a rule, attaching it');
      this.defaultEnvironment.rule = rule;
    }

    await this.repository.save(this.defaultEnvironment);

    this.logger.log('Example environment created');
  }
}
