import { Logger as NestLogger } from '@nestjs/common';
import Config from 'config';

export class Logger extends NestLogger {
  static debug(message: any, context = '', isTimeDiffEnabled = true) {
    if (Config.get('settings.debug')) {
      NestLogger.debug(message, context, isTimeDiffEnabled);
    }
  }
}
