import { AnyAction } from 'redux';

export interface AppAction<T extends string = any> extends AnyAction {
  type: T;
}

export interface PayloadAction<T extends string = any, P = any> extends AppAction<T> {
  payload: P;
}

export interface BaseModel<I = number> {
  id: I;
  createdAt: Date;
}
