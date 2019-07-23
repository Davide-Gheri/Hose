import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Environment } from '../entities/environment.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Record } from '../entities/record.entity';
import { Logger } from '../../../Logger';
import { GpioService } from '../../gpio/services/gpio.service';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectRepository(Environment)
    private readonly repository: Repository<Environment>,
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    private readonly gpioService: GpioService,
  ) {}

  async getRecords(envId: string, option?: FindManyOptions) {
    const env = await this.repository.findOneOrFail(envId);
    return this.getRecordsByBoard(env.boardId, option);
  }

  getRecordsByBoard(boardId: string, option?: FindManyOptions) {
    return this.recordRepository.find({...option, boardId});
  }

  async getEnvRecord(envId: string, id: string) {
    await this.repository.findOneOrFail(envId);
    return this.recordRepository.findOneOrFail(id);
  }

  async checkBoardId(envId, boardId) {
    const env = await this.repository.findOneOrFail(envId);
    if (env.boardId !== boardId) {
      throw new BadRequestException('BoardId does not match');
    }
  }

  async addRecord(envId: string, payload: Record | Partial<Record>) {
    await this.checkBoardId(envId, payload.boardId);

    const record = await this.recordRepository.save(payload);

    this.checkLevel(envId, record);

    return record;
  }

  async checkLevel(envId: string, record: Record) {
    const env = await this.repository.findOneOrFail(envId);
    const { minHumidity } = env.rule;
    if (record.reading <= minHumidity) {
      Logger.log('HUMIDITY TOO LOW, NEED WATER', 'EnvironmentService');
      this.gpioService.exec(env);
    }
  }
}
