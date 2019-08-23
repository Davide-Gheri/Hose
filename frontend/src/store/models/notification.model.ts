import { BaseModel } from '../interfaces';

export interface NotificationModel extends BaseModel<string> {
  title: string;
  description?: string;
  createdAt: Date;
}
