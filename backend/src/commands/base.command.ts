import { Logger } from '../Logger';
import { OnModuleInit } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';

export abstract class BaseCommand implements OnModuleInit {
  protected abstract logNamespace: string;

  protected abstract connection: Connection;

  protected abstract repository: Repository<any>;

  protected logger: Logger;

  onModuleInit(): any {
    this.logger = new Logger(this.logNamespace);
  }

  protected async deleteOldRecords() {
    this.logger.log('Deleting old records');
    await this.connection.query('PRAGMA foreign_keys = OFF');
    await this.repository.createQueryBuilder()
    .delete()
    .execute();
    await this.connection.query('PRAGMA foreign_keys = ON');
  }
}
