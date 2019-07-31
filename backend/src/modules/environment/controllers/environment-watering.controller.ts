import { Controller, Get, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Environment } from '../entities/environment.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../validation/PaginationQuery.dto';
import { Watering } from '../entities/watering.entity';

@Controller('environments/:environmentId/waterings')
export class EnvironmentWateringController {
  constructor(
    @InjectRepository(Watering)
    private readonly repository: Repository<Watering>,
  ) {}

  @Get()
  async index(
    @Param('environmentId') envId: string,
    @Query() paginationQuery?: PaginationQueryDto,
  ) {

    const options = {
      orderBy: 'createdAt|ASC',
      environmentId: envId,
      ...paginationQuery,
    };

    const finalOptions = Object.keys(options).reduce((obj, k) => {
      if (k === 'orderBy') {
        const [field, order] = options[k].split('|');
        obj.order = {[field]: order};
      } else {
        obj[k] = options[k];
      }
      return obj;
    }, {} as FindManyOptions<Watering>);

    return this.repository.find(finalOptions);
  }
}
