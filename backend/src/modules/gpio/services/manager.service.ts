import { HttpService, Injectable } from '@nestjs/common';
import Config from 'config';
import { tap } from 'rxjs/operators';
import { Logger } from '../../../Logger';

const GPIO_PLACEHOLDER = ':id';

@Injectable()
export class ManagerService {
  private readonly baseUrl: string = Config.get('gpio.managerUrl');

  constructor(
    private readonly http: HttpService,
  ) {}

  private composeUrl(pin: number) {
    return this.baseUrl
    .replace(GPIO_PLACEHOLDER, pin.toString());
  }

  private callManager(pin: number, command: 'ON' | 'OFF') {
    return this.http.post(this.composeUrl(pin), {
      command: command.toUpperCase(),
    }).pipe(
      tap(() => Logger.debug(`Sent ${command} command to pin ${pin}`, 'GpioService')),
    );
  }

  sendOn(pin: number) {
    return this.callManager(pin, 'ON');
  }

  sendOff(pin: number) {
    return this.callManager(pin, 'OFF');
  }
}
