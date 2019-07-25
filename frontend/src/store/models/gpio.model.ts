import { BaseModel } from '../index';

export interface GpioModel extends BaseModel<string> {
  pin: number;
}
