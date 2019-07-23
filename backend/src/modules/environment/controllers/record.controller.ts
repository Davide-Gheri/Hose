import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from '../entities/record.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../validation/PaginationQuery.dto';

@Controller('records')
export class RecordController {
  constructor(
    @InjectRepository(Record)
    private readonly repository: Repository<Record>,
  ) {}

  @Get()
  async index(
    @Query() paginationQuery?: PaginationQueryDto,
  ) {
    const options = paginationQuery || {};

    return this.repository.find(options);
  }

  @Get('/:recordId')
  async show(
    @Param('recordId') id: string,
  ) {
    return this.repository.findOneOrFail(id);
  }

  @Post()
  async create(
    @Body() createDto: Record,
  ) {
    return this.repository.save(createDto);
  }

  @Patch('/:recordId')
  async update(
    @Param('recordId') id: string,
    @Body() updateDto: any,
  ) {
    const record = await this.repository.findOneOrFail(id);

    Object.assign(record, updateDto);

    await this.repository.save(record);

    return record;
  }

  @Put('/:recordId')
  async replace(
    @Param('recordId') id: string,
    @Body() replaceDto: Record,
  ) {
    return this.update(id, replaceDto);
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
