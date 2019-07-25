import { AnyAction, combineReducers, createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { environmentsReducer } from './environments';
import { EnvironmentState } from './environments/reducer';
import { dashboardReducer } from './dashboard';
import { DashboardState } from './dashboard/reducer';
import { recordsReducer } from './records';
import { RecordsState } from './records/reducer';

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

const rootReducer = combineReducers({
  environments: environmentsReducer,
  dashboard: dashboardReducer,
  records: recordsReducer,
});

export interface AppState {
  environments: EnvironmentState;
  dashboard: DashboardState;
  records: RecordsState;
  [key: string]: any;
}

export const configureStore = () => {
  const logger = createLogger();
  return createStore(
    rootReducer,
    applyMiddleware(thunk, logger),
  );
};
