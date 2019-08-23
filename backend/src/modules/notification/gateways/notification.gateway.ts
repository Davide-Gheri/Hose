import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Client } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';

@WebSocketGateway(8888, {namespace: 'notifications'})
export class NotificationGateway {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
  ) {}

  @WebSocketServer()
  private server: Server;

  public broadcast(message: any) {
    this.server.emit('new', message);
  }

  @SubscribeMessage('get')
  handleGet(): Promise<NotificationEntity[]> {
    return this.repository.find();
  }

  @SubscribeMessage('read')
  handleRead(client: Client, payload: {id: string}) {
    return this.repository.delete(payload.id);
  }

  @SubscribeMessage('readAll')
  handleReadAll() {
    // A payload is needed, else the client callback is not fired
    return this.repository.clear().then(() => 'ok');
  }
}
