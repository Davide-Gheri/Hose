import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardController } from './controllers/board.controller';
import { CommandModule } from 'nestjs-command';
import { InstallBoardCommand } from './commands/install-board.command';
import { BoardSeedCommand } from './commands/board-seed.command';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    CommandModule,
  ],
  providers: [
    InstallBoardCommand,
    BoardSeedCommand,
  ],
  exports: [
    InstallBoardCommand,
    BoardSeedCommand,
  ],
  controllers: [BoardController],
})
export class BoardModule {}
