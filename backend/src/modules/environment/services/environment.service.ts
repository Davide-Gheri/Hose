import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Repository } from 'typeorm';
import Config from 'config';
import { Environment } from '../entities/environment.entity';
import { Logger } from '../../../Logger';
import { GpioService } from '../../gpio/services/gpio.service';
import { InfluxService } from '../../influx/services/influx.service';
import { PaginationQueryDto } from '../../../validation/PaginationQuery.dto';
import { Record } from '../entities/record.entity';
import { Watering } from '../entities/watering.entity';
import { Board } from '../../board/entities/board.entity';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectRepository(Environment)
    private readonly repository: Repository<Environment>,
    @InjectRepository(Watering)
    private readonly wateringRepository: Repository<Watering>,
    private readonly gpioService: GpioService,
    private readonly influx: InfluxService,
  ) {}

  async getRecords(envId: string, options: PaginationQueryDto) {
    const env = await this.repository.findOneOrFail(envId);
    return this.getRecordsByBoard(env.board, options);
  }

  getRecordsByBoard(board: Board, {skip = 0, take = 10}: PaginationQueryDto) {
    if (!board) {
      return [];
    }
    const query = `
      select * from ${Config.get('influx.schema.table')}
      where boardId = ${this.influx.escape.stringLit(board.id)}
      order by time desc
      ${(!isNil(skip) && take) ? `limit ${take} offset ${skip}` : ''}
      `;
    return this.influx.find(query);
  }

  async checkBoardId(envId, boardId) {
    const env = await this.repository.findOneOrFail(envId);
    if (env.board.id !== boardId) {
      throw new BadRequestException('BoardId does not match');
    }
  }

  async addRecord(envId: string, payload: Record | Partial<Record>) {
    await this.checkBoardId(envId, payload.boardId);

    await this.influx.insert({
      measurement: Config.get('influx.schema.table'),
      fields: {
        record: payload.reading,
      },
      tags: {
        boardId: payload.boardId,
      },
    });

    this.checkLevel(envId, payload as Record);
  }

  async checkLevel(envId: string, record: Record) {
    const env = await this.repository.findOneOrFail(envId);
    const { minHumidity } = env.rule;

    const scheduledWatering = await this.wateringRepository.createQueryBuilder()
      .where('environmentId = :envId', {envId}) // TODO use relations
      .andWhere('processedAt is null')
      .getMany();

    if (record.reading <= minHumidity) {
      Logger.log('HUMIDITY TOO LOW, SCHEDULING WATER', 'EnvironmentService');
      if (!scheduledWatering || scheduledWatering.length === 0) {
        Logger.debug('Adding a new watering schedule', 'EnvironmentService');
        await this.wateringRepository.save({
          environment: env,
        });
      }
      // this.gpioService.exec(env);
    } else {
      Logger.debug('An old scheduled watering is no more necessary', 'EnvironmentService');
      await this.wateringRepository.delete(scheduledWatering.map(w => w.id));
    }
  }

  async deleteRecordsByBoard(board: Board) {
    const query = `boardId = ${this.influx.escape.stringLit(board.id)}`;
    return this.influx.delete(query);
  }
}
