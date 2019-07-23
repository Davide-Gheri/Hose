import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { CommandModule } from 'nestjs-command';
import { InstallRulesCommand } from './commands/install-rules.command';
import { RuleController } from './controllers/rule.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rule]),
    CommandModule,
  ],
  providers: [
    InstallRulesCommand,
  ],
  exports: [
    InstallRulesCommand,
  ],
  controllers: [RuleController],
})
export class RuleModule {}
