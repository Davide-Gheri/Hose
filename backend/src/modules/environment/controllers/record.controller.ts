import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Record } from '../entities/record.entity';
import { PaginationQueryDto } from '../../../validation/PaginationQuery.dto';
import { InfluxService } from '../../influx/services/influx.service';
import Config from 'config';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Controller('records')
export class RecordController {
  constructor(
    private readonly influx: InfluxService,
  ) {}

  @Get()
  async index(
    @Query() options?: PaginationQueryDto,
  ) {
    const { skip = 0, take = 10 } = options || {};
    const query = `
      select * from ${Config.get('influx.schema.table')}
      order by time desc
      ${(!isNil(skip) && take) ? `limit ${take} offset ${skip}` : ''}
      `;
    return this.influx.find(query);
  }

  @Post()
  async create(
    @Body() createDto: Record,
  ) {
    return this.influx.insert({
      measurement: Config.get('influx.schema.table'),
      fields: {
        record: createDto.reading,
      },
      tags: {
        boardId: createDto.boardId,
      },
    });
  }
}
