import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { Rule } from '../entities/rule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ParsedQuery } from '../../../decorators';

@Controller('rules')
export class RuleController {
  constructor(
    @InjectRepository(Rule)
    private readonly repository: Repository<Rule>,
  ) {}

  @Get()
  async index(
    @ParsedQuery() query: FindManyOptions,
  ) {
    return this.repository.find(query);
  }

  @Get('/:ruleId')
  async show(
    @Param('ruleId') id: string,
  ) {
    return this.repository.findOneOrFail(id);
  }

  @Post()
  async create(
    @Body() createDto: Rule,
  ) {
    return this.repository.save(createDto);
  }

  @Patch('/:ruleId')
  async update(
    @Param('ruleId') id: string,
    @Body() updateDto: any,
  ) {
    const rule = await this.repository.findOneOrFail(id);

    Object.assign(rule, updateDto);

    await this.repository.save(rule);

    return rule;
  }

  @Put('/:ruleId')
  async replace(
    @Param('ruleId') id: string,
    @Body() replaceDto: Rule,
  ) {
    return this.update(id, replaceDto);
  }

  @Delete('/:ruleId')
  async delete(
    @Param('ruleId') id: string,
  ) {
    await this.repository.findOneOrFail(id);
    await this.repository.delete(id);

    return {};
  }
}
