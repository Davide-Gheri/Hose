import { BaseModel } from '../index';

export interface BoardModel extends BaseModel<string> {
  checkUrl: null | string;
  createdAt: any;
  lastCheckedAt: any;
  isDown: null | boolean;
}
