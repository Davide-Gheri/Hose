import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationService } from './services/notification.service';
import { NotificationGateway } from './gateways/notification.gateway';
import { NotController } from './not.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  providers: [NotificationService, NotificationGateway],
  controllers: [NotController],
})
export class NotificationModule {}
