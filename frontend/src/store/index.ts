import { AnyAction, combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';
import { makeLogger } from '../lib/logger';
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
import { boardsReducer } from './boards';
import { BoardsState } from './boards/reducer';

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
  boards: boardsReducer,
});

export interface AppState {
  environments: EnvironmentState;
  dashboard: DashboardState;
  records: RecordsState;
  rules: RulesState;
  gpios: GpiosState;
  waterings: WateringState;
  boards: BoardsState;
  [key: string]: any;
}

const logger = makeLogger('redux', true);

export const configureStore = () => {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const loggerMiddleware = createLogger({
    logger,
  });
  const middleware = applyMiddleware(thunk, loggerMiddleware);
  return createStore(
    rootReducer,
    composeEnhancers(middleware),
  );
};

export const useThunkDispatch = () => useDispatch<ThunkDispatch<{}, {}, PayloadAction>>();
