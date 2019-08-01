import { BaseModel } from '../index';
import { GpioModel } from './gpio.model';
import { RuleModel } from './rule.model';
import { BoardModel } from './board.model';

export interface EnvironmentModel extends BaseModel<string> {
  title: string;
  description?: string;
  updatedAt: Date;
  gpios: GpioModel[];
  rule: RuleModel;
  board: BoardModel | null;
}
