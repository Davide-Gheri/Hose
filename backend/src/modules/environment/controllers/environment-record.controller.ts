import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from '../entities/record.entity';
import { Repository } from 'typeorm';
import { Environment } from '../entities/environment.entity';
import { PaginationQueryDto } from '../../../validation/PaginationQuery.dto';
import { EnvironmentService } from '../services/environment.service';

@Controller('environments/:environmentId/records')
export class EnvironmentRecordController {
  constructor(
    @InjectRepository(Record)
    private readonly repository: Repository<Record>,
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

  @Get('/:recordId')
  async show(
    @Param('environmentId') envId: string,
    @Param('recordId') id: string,
  ) {
    return this.service.getEnvRecord(envId, id);
  }

  @Post()
  async create(
    @Param('environmentId') envId: string,
    @Body() createDto: Record,
  ) {
    return this.service.addRecord(envId, createDto);
  }

  @Patch('/:recordId')
  async update(
    @Param('environmentId') envId: string,
    @Param('recordId') id: string,
    @Body() updateDto: any,
  ) {
    await this.service.checkBoardId(envId, updateDto.boardId);

    const record = await this.repository.findOneOrFail(id);

    Object.assign(record, updateDto);

    await this.repository.save(record);

    return record;
  }

  @Put('/:recordId')
  async replace(
    @Param('environmentId') envId: string,
    @Param('recordId') id: string,
    @Body() replaceDto: Record,
  ) {
    return this.update(envId, id, replaceDto);
  }

  @Delete('/:recordId')
  async delete(
    @Param('recordId') id: string,
  ) {
    await this.repository.findOneOrFail(id);
    await this.repository.delete(id);

    return null;
  }
}
