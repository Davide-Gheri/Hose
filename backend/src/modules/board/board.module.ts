import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardController } from './controllers/board.controller';
import { CommandModule } from 'nestjs-command';
import { InstallBoardCommand } from './commands/install-board.command';
import { BoardSeedCommand } from './commands/board-seed.command';
import { HealthCheckService } from './services/health-check.service';
import { ScheduleModule } from 'nest-schedule';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    ScheduleModule,
    HttpModule,
    TypeOrmModule.forFeature([Board]),
    CommandModule,
    NotificationModule,
  ],
  providers: [
    InstallBoardCommand,
    BoardSeedCommand,
    HealthCheckService,
  ],
  exports: [
    InstallBoardCommand,
    BoardSeedCommand,
  ],
  controllers: [BoardController],
})
export class BoardModule {}
