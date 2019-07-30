import { Controller, Get, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Environment } from '../entities/environment.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../validation/PaginationQuery.dto';

@Controller('environments/:environmentId/waterings')
export class EnvironmentWateringController {
  constructor(
    @InjectRepository(Environment)
    private readonly envRepository: Repository<Environment>,
  ) {}

  @Get()
  async index(
    @Param('environmentId') envId: string,
    @Query() paginationQuery?: PaginationQueryDto,
  ) {
    const env = await this.envRepository.findOneOrFail(envId, {relations: ['watering']});
    return env.watering;
  }
}
