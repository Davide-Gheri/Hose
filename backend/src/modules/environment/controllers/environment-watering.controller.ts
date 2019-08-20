import { Controller, Get, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../validation/PaginationQuery.dto';
import { Watering } from '../entities/watering.entity';
import { ParsedQuery } from '../../../decorators';

@Controller('environments/:environmentId/waterings')
export class EnvironmentWateringController {
  constructor(
    @InjectRepository(Watering)
    private readonly repository: Repository<Watering>,
  ) {}

  @Get()
  async index(
    @Param('environmentId') envId: string,
    @ParsedQuery() query: FindManyOptions,
    @Query() paginationQuery?: PaginationQueryDto,
  ) {
    const finalQuery: FindManyOptions = {
      ...query,
      where: {
        ...query.where as object,
        environmentId: envId,
      },
    };

    return this.repository.find(finalQuery);
  }
}
