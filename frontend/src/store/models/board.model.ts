import { BaseModel } from '../index';
import { EnvironmentModel } from './environment.model';

export interface BoardModel extends BaseModel<string> {
  checkUrl: null | string;
  createdAt: any;
  lastCheckedAt: any;
  isDown: null | boolean;
  environmentId?: null | string;
}
