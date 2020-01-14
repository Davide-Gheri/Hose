import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './services/notification.service';
import { NotificationGateway } from './gateways/notification.gateway';
import { NotController } from './not.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
  ],
  exports: [
    NotificationService,
  ],
  providers: [NotificationService, NotificationGateway],
  controllers: [NotController],
})
export class NotificationModule {}
