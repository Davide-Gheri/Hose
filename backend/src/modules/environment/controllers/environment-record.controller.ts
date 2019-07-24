import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from '../entities/record';
import { Repository } from 'typeorm';
import { Environment } from '../entities/environment.entity';
import { PaginationQueryDto } from '../../../validation/PaginationQuery.dto';
import { EnvironmentService } from '../services/environment.service';

@Controller('environments/:environmentId/records')
export class EnvironmentRecordController {
  constructor(
    @InjectRepository(Environment)
    private readonly envRepository: Repository<Environment>,
    private readonly service: EnvironmentService,
  ) {}

  @Get()
  async index(
    @Param('environmentId') envId: string,
    @Query() paginationQuery?: PaginationQueryDto,
  ) {
    return this.service.getRecords(envId, paginationQuery);
  }

  @Post()
  async create(
    @Param('environmentId') envId: string,
    @Body() createDto: Record,
  ) {
    return this.service.addRecord(envId, createDto);
  }
}
