import { BaseModel } from '../interfaces';
import { EnvironmentModel } from './environment.model';

export interface GpioModel extends BaseModel<string> {
  pin: number;
  environments: EnvironmentModel[];
}
