import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../../../validation/PaginationQuery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Environment } from '../entities/environment.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Rule } from '../../rule/entities/rule.entity';
import { GpioService } from '../../gpio/services/gpio.service';
import { EnvironmentService } from '../services/environment.service';

@Controller('environments')
export class EnvironmentController {
  constructor(
    @InjectRepository(Environment)
    private readonly repository: Repository<Environment>,
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
    private readonly gpioService: GpioService,
    private readonly service: EnvironmentService,
  ) {}

  @Get()
  async index(
    @Query() paginationQuery?: PaginationQueryDto,
  ) {

    const options = {
      orderBy: 'createdAt|ASC',
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
    }, {} as FindManyOptions<Environment>);

    return this.repository.find(finalOptions);
  }

  @Get('/:environmentId')
  async show(
    @Param('environmentId') id: string,
  ) {
    return this.repository.findOneOrFail(id);
  }

  @Post()
  async create(
    @Body() createDto: Environment,
  ) {
    if (createDto.rule) {
      createDto.rule = await this.getRule((createDto as any).rule as string);
    }

    if (createDto.gpios && createDto.gpios.length) {
      for (const idx of createDto.gpios.keys()) {
        (createDto as any).gpios[idx] = await this.gpioService.ensureGpio((createDto as any).gpios[idx] as number);
      }
    }

    return this.repository.save(createDto);
  }

  @Patch('/:environmentId')
  async update(
    @Param('environmentId') id: string,
    @Body() updateDto: any,
  ) {
    const environment = await this.repository.findOneOrFail(id);

    if (updateDto.rule) {
      updateDto.rule = await this.getRule(updateDto.rule as string);
    }

    if (updateDto.gpios && updateDto.gpios.length) {
      for (const idx of updateDto.gpios.keys()) {
        (updateDto as any).gpios[idx] = await this.gpioService.ensureGpio((updateDto as any).gpios[idx] as number);
      }
    }

    Object.assign(environment, updateDto);

    await this.repository.save(environment);

    return environment;
  }

  @Put('/:environmentId')
  async replace(
    @Param('environmentId') id: string,
    @Body() replaceDto: Environment,
  ) {
    return this.update(id, replaceDto);
  }

  @Delete('/:environmentId')
  async delete(
    @Param('environmentId') id: string,
  ) {
    const env = await this.repository.findOneOrFail(id);
    await this.repository.delete(id);

    await this.service.deleteRecordsByBoard(env.boardId);

    return null;
  }

  private getRule(ruleId: string) {
    return this.ruleRepository.findOneOrFail(ruleId);
  }
}
