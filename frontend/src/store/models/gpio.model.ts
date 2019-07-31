import { BaseModel } from '../index';
import { EnvironmentModel } from './environment.model';

export interface GpioModel extends BaseModel<string> {
  pin: number;
  environments: EnvironmentModel[];
}
