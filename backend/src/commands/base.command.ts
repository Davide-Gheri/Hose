import { Logger } from '../Logger';
import { OnModuleInit } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { DbChecker } from '../lib/db-checker';

/**
 * Abstract command class
 * All commands could extend this class to inherit common settings
 */
export abstract class BaseCommand implements OnModuleInit {
  protected abstract logNamespace: string;

  protected abstract connection: Connection;

  protected abstract repository: Repository<any>;

  protected logger: Logger;

  onModuleInit(): void {
    // Create a new logger instance with a custom namespace (usually the class name)
    this.logger = new Logger(this.logNamespace);
  }

  /**
   * Delete all existing records
   * Needs to disable foreign keys check
   */
  protected async deleteOldRecords(): Promise<void> {
    this.logger.log('Deleting old records');
    await this.connection.query(DbChecker.disableFkCheck());
    await this.repository.createQueryBuilder()
      .delete()
      .execute();
    await this.connection.query(DbChecker.enableFkCheck());
  }
}
