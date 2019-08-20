import { BaseModel } from '../index';

export interface RuleModel extends BaseModel<string> {
  title: string;
  minHumidity: number;
  wateringSeconds: number;
  updatedAt: any;
  environmentIds: string[];
}
