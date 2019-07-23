import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { InstallEnvironmentCommand } from '../modules/environment/commands/install-environment.command';
import { InstallRulesCommand } from '../modules/rule/commands/install-rules.command';
import { Logger } from '../Logger';

@Injectable()
export class InstallCommand {

  constructor(
    private readonly envCommand: InstallEnvironmentCommand,
    private readonly ruleCommand: InstallRulesCommand,
  ) {}

  @Command({
    command: 'install',
    aliases: 'i',
    describe: 'Install the app',
  })
  async run() {
    await this.ruleCommand.run(true);
    await this.envCommand.run(true);

    Logger.log('Install complete', 'InstallCommand');
  }
}
