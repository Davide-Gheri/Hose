import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { Repository } from 'typeorm';
import { NotificationGateway } from '../gateways/notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
    private readonly gateway: NotificationGateway,
  ) {}

  emit(data: Partial<NotificationEntity>): Promise<NotificationEntity> {
    return this.repository.save(data)
      .then(notification => {
        this.gateway.broadcast(notification);
        return notification;
      });
  }

  remove(id: string) {
    return this.repository.delete(id);
  }

  removeAll() {
    return this.repository.clear().then(() => ({}));
  }
}
