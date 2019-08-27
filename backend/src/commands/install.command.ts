import { Injectable } from '@nestjs/common';
import { Command, Option } from 'nestjs-command';
import { InstallEnvironmentCommand } from '../modules/environment/commands/install-environment.command';
import { InstallRulesCommand } from '../modules/rule/commands/install-rules.command';
import { Logger } from '../Logger';
import { InstallGpiosCommand } from '../modules/gpio/commands/install-gpios.command';
import { InstallBoardCommand } from '../modules/board/commands/install-board.command';
import { RecordSeedCommand } from '../modules/environment/commands/record-seed.command';
import { BoardSeedCommand } from '../modules/board/commands/board-seed.command';

/**
 * Install the app
 * Remove all old records
 * Optionally seeds the db
 */
@Injectable()
export class InstallCommand {

  constructor(
    private readonly gpioCommand: InstallGpiosCommand,
    private readonly ruleCommand: InstallRulesCommand,
    private readonly boardCommand: InstallBoardCommand,
    private readonly envCommand: InstallEnvironmentCommand,
    private readonly recordsSeedCommand: RecordSeedCommand,
    private readonly boardsSeedCommand: BoardSeedCommand,
  ) {}

  @Command({
    command: 'install',
    aliases: 'i',
    describe: 'Install the app',
  })
  async run(
    @Option({
      name: 's',
      alias: 'seed',
      boolean: true,
      describe: 'Seed db with fake data',
    }) seed: boolean = false,
  ) {
    await this.gpioCommand.run(true);
    await this.ruleCommand.run(true);
    await this.boardCommand.run(true);
    await this.envCommand.run(true);

    if (seed) {
      await this.recordsSeedCommand.run(1000, [], true);
      await this.boardsSeedCommand.run(10, false);
    }

    Logger.log('Install complete', 'InstallCommand');
  }
}
