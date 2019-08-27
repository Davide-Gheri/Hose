import { HttpService, Injectable } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import Config from 'config';
import { Logger } from '../../../Logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from '../entities/board.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../../notification/services/notification.service';

@Injectable()
export class HealthCheckService extends NestSchedule {
  private logger: Logger = new Logger('HealthCheckService');

  constructor(
    @InjectRepository(Board)
    private readonly repository: Repository<Board>,
    private readonly http: HttpService,
    private readonly notification: NotificationService,
  ) {
    super();
  }

  @Cron(Config.get('board.healthCheckCron'))
  async runHealthChecks() {
    this.logger.log('Running healthcheck cron');
    const boards = await this.getBoardsToCheck();
    if (boards.length === 0) {
      this.logger.log('No boards to check');
      return;
    }
    for (const board of boards) {
      await this.checkBoard(board);
    }
    this.logger.log('All healthchecks completed');
  }

  private getBoardsToCheck() {
    return this.repository.createQueryBuilder()
      .where('checkUrl is not null')
      .getMany();
  }

  private async checkBoard(board: Board) {
    if (!board.checkUrl) {
      return;
    }
    this.logger.debug(`Health check for board ${board.id}, url: ${board.checkUrl}`);
    return this.http.get(board.checkUrl)
      .toPromise()
      .then(res => {
        this.logger.debug(`Health check for board ${board.id} SUCCESS`);
        board.lastCheckedAt = new Date();
        board.isDown = false;
        return this.repository.save(board);
      })
      .catch(async (err) => {
        this.logger.error(`Health check for board ${board.id} FAILED`);
        board.lastCheckedAt = new Date();
        board.isDown = true;
        await this.notify({
          title: 'notifications:failed_healthcheck',
          description: board.checkUrl,
        });
        return this.repository.save(board);
      });
  }

  private async notify(data: any) {
    return this.notification.emit(data);
  }
}
