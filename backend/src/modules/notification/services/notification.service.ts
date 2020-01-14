import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { Repository } from 'typeorm';
import { NotificationGateway } from '../gateways/notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
    private readonly gateway: NotificationGateway,
  ) {}

  emit(data: Partial<Notification>): Promise<Notification> {
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
