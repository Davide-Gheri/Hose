import { BaseModel } from '../index';
import { GpioModel } from './gpio.model';
import { RuleModel } from './rule.model';

export interface EnvironmentModel extends BaseModel<string> {
  title: string;
  description?: string;
  boardId?: string;
  updatedAt: Date;
  gpios: GpioModel[];
  rule: RuleModel;
}
