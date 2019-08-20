import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gpio } from '../entities/gpio.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { GpioService } from '../services/gpio.service';
import { ParsedQuery } from '../../../decorators';

@Controller('gpios')
export class GpioController {
  constructor(
    @InjectRepository(Gpio)
    private readonly repository: Repository<Gpio>,
    private readonly gpioService: GpioService,
  ) {}

  @Get()
  async index(
    @ParsedQuery({relations: ['environments']}) query: FindManyOptions,
  ) {
    return this.repository.find(query);
  }

  @Get('/:gpioId')
  async show(
    @Param('gpioId') id: string,
  ) {
    return this.repository.findOneOrFail(id);
  }

  @Post()
  async create(
    @Body() createDto: Gpio,
  ) {
    await this.gpioService.ensureUnique(createDto.pin);
    return this.repository.save(createDto);
  }

  @Patch('/:gpioId')
  async update(
    @Param('gpioId') id: string,
    @Body() updateDto: any,
  ) {
    const gpio = await this.repository.findOneOrFail(id);

    Object.assign(gpio, updateDto);

    await this.repository.save(gpio);

    return gpio;
  }

  @Put('/:gpioId')
  async replace(
    @Param('gpioId') id: string,
    @Body() replaceDto: Gpio,
  ) {
    return this.update(id, replaceDto);
  }

  @Delete('/:gpioId')
  async delete(
    @Param('gpioId') id: string,
  ) {
    await this.repository.findOneOrFail(id);
    await this.repository.delete(id);

    return {};
  }
}
