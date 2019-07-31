import { AnyAction, combineReducers, createStore, applyMiddleware, StoreEnhancer, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { environmentsReducer } from './environments';
import { EnvironmentState } from './environments/reducer';
import { dashboardReducer } from './dashboard';
import { DashboardState } from './dashboard/reducer';
import { recordsReducer } from './records';
import { RecordsState } from './records/reducer';
import { rulesReducer } from './rules';
import { RulesState } from './rules/reducer';
import { gpiosReducer } from './gpios';
import { GpiosState } from './gpios/reducer';
import { wateringsReducer } from './waterings';
import { WateringState } from './waterings/reducer';

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
  rules: rulesReducer,
  gpios: gpiosReducer,
  waterings: wateringsReducer,
});

export interface AppState {
  environments: EnvironmentState;
  dashboard: DashboardState;
  records: RecordsState;
  rules: RulesState;
  gpios: GpiosState;
  waterings: WateringState;
  [key: string]: any;
}

const LOG_ENABLED = false;

export const configureStore = () => {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  let middleware: StoreEnhancer<any, any>;
  if (LOG_ENABLED) {
    const logger = createLogger();
    middleware = applyMiddleware(thunk, logger);
  } else {
    middleware = applyMiddleware(thunk);
  }

  return createStore(
    rootReducer,
    composeEnhancers(middleware),
  );
};
