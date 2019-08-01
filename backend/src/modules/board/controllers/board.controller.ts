import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Board } from '../entities/board.entity';
import { EntityManager, FindManyOptions, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../validation/PaginationQuery.dto';
import { BoardFiltersDto } from '../dtos/BoardFiltersDto';
import { Environment } from '../../environment/entities/environment.entity';

@Controller('boards')
export class BoardController {
  constructor(
    @InjectRepository(Board)
    private readonly repository: Repository<Board>,
  ) {}

  @Get()
  async index(
    @Query() filterQuery?: BoardFiltersDto,
  ) {
    const options = {
      orderBy: 'createdAt|ASC',
      ...filterQuery,
    };

    const finalOptions = Object.keys(options).reduce((obj, k) => {
      if (k === 'orderBy') {
        const [field, order] = options[k].split('|');
        obj.order = {[field]: order};
      } else if (k !== 'onlyOrphans') {
        obj[k] = options[k];
      }
      return obj;
    }, {} as FindManyOptions<Board>);

    if (options.onlyOrphans) {

    }

    const builder = this.repository.createQueryBuilder();

    if (options.take) {
      builder.take(options.take);
    }
    if (options.skip) {
      builder.skip(options.skip);
    }
    if (options.orderBy) {
      const [field, order] = options.orderBy.split('|');
      builder.orderBy(field, order as 'ASC' | 'DESC');
    }

    if (options.onlyOrphans) {
      builder.where('not EXISTS (SELECT * from environment where environment.boardId = board.id)');
    }

    return builder.getMany();
  }

  @Get('/:boardId')
  async show(
    @Param('boardId') id: string,
  ) {
    return this.repository.findOneOrFail(id);
  }

  @Post()
  async create(
    @Body() createDto: Board,
  ) {
    return this.repository.save(createDto);
  }

  @Patch('/:boardId')
  async update(
    @Param('boardId') id: string,
    @Body() updateDto: any,
  ) {
    const board = await this.repository.findOneOrFail(id);

    Object.assign(board, updateDto);

    await this.repository.save(board);

    return board;
  }

  @Put('/:boardId')
  async replace(
    @Param('boardId') id: string,
    @Body() replaceDto: Board,
  ) {
    return this.update(id, replaceDto);
  }

  @Delete('/:boardId')
  async delete(
    @Param('boardId') id: string,
  ) {
    await this.repository.findOneOrFail(id);
    await this.repository.delete(id);

    return {};
  }
}
