import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Environment } from '../entities/environment.entity';
import { Connection, Repository } from 'typeorm';
import { Rule } from '../../rule/entities/rule.entity';
import { FreshOption } from '../../../commands/FreshOption';
import { BaseCommand } from '../../../commands/base.command';
import { Gpio } from '../../gpio/entities/gpio.entity';

@Injectable()
export class InstallEnvironmentCommand extends BaseCommand {
  protected logNamespace = 'InstallEnvironmentCommand';

  private defaultEnvironment: Partial<Environment> = {
    title: 'My environment',
    description: 'This is an example environment, you can edit or delete it',
    boardId: 'exampleId123',
    gpios: [],
  };

  constructor(
    @InjectRepository(Environment)
    protected readonly repository: Repository<Environment>,
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
    @InjectRepository(Gpio)
    private readonly gpioRepository: Repository<Gpio>,
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

    const rule = await this.getRule();

    if (rule) {
      this.logger.debug('Found a rule, attaching it');
      this.defaultEnvironment.rule = rule;
    }

    const gpio = await this.getGpio();

    if (gpio) {
      this.logger.debug('Found a GPIO, attaching it');
      this.defaultEnvironment.gpios.push(gpio);
    }

    await this.repository.save(this.defaultEnvironment);

    this.logger.log('Example environment created');
  }

  private getRule() {
    return this.ruleRepository.createQueryBuilder()
      .getOne();
  }

  private getGpio() {
    return this.gpioRepository.createQueryBuilder()
      .where('pin = :pin', {pin: 17})
      .getOne();
  }
}
