import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';

@Controller('notifications')
export class NotController {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
    private readonly service: NotificationService,
  ) {}

  @Get()
  index() {
    return this.repository.find();
  }

  @Post()
  create(
    @Body() data: any,
  ) {
    return this.service.emit(data);
  }

}
