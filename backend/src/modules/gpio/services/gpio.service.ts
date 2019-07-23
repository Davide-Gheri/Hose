import { HttpService, Injectable } from '@nestjs/common';
import Config from 'config';
import { Environment } from '../../environment/entities/environment.entity';
import { tap } from 'rxjs/operators';
import { Logger } from '../../../Logger';
import { sleep } from '../../lib';

const GPIO_PLACEHOLDER = ':id';

@Injectable()
export class GpioService {
  private baseUrl: string = Config.get('gpio.managerUrl');

  constructor(
    private readonly http: HttpService,
  ) {}

  private composeUrl(id: number) {
    return this.baseUrl
      .replace(GPIO_PLACEHOLDER, id.toString());
  }

  private callManager(id: number, command: 'ON' | 'OFF') {
    return this.http.post(this.composeUrl(id), {
      command: command.toUpperCase(),
    }).pipe(
      tap(() => Logger.debug(`Sent ${command} command to pin ${id}`, 'GpioService')),
    );
  }

  async exec(environment: Environment) {
    if (!environment.gpios) {
      return;
    }
    for (const gpio of environment.gpios) {
      await this.sendOn(gpio).toPromise()
        .then(() => {
          sleep(environment.rule.wateringSeconds * 1000)
            .then(() => this.sendOff(gpio));
        });
    }
  }

  sendOn(id: number) {
    return this.callManager(id, 'ON');
  }

  sendOff(id: number) {
    return this.callManager(id, 'OFF');
  }
}
