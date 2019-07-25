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
import { Record } from '../entities/record';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectRepository(Environment)
    private readonly repository: Repository<Environment>,
    private readonly gpioService: GpioService,
    private readonly influx: InfluxService,
  ) {}

  async getRecords(envId: string, options: PaginationQueryDto) {
    const env = await this.repository.findOneOrFail(envId);
    return this.getRecordsByBoard(env.boardId, options);
  }

  getRecordsByBoard(boardId: string, {skip = 0, take = 10}: PaginationQueryDto) {
    const query = `
      select * from ${Config.get('influx.schema.table')}
      where boardId = ${this.influx.escape.stringLit(boardId)}
      order by time desc
      ${(!isNil(skip) && take) ? `limit ${take} offset ${skip}` : ''}
      `;
    return this.influx.find(query);
  }

  async checkBoardId(envId, boardId) {
    const env = await this.repository.findOneOrFail(envId);
    if (env.boardId !== boardId) {
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
    if (record.reading <= minHumidity) {
      Logger.log('HUMIDITY TOO LOW, NEED WATER', 'EnvironmentService');
      this.gpioService.exec(env);
    }
  }
}
