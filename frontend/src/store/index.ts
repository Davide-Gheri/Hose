import { AnyAction, combineReducers, createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { environmentsReducer } from './environments'
import { EnvironmentState } from './environments/reducer';

export interface AppAction<T extends string = any> extends AnyAction {
  type: T;
}

export interface PayloadAction<T extends string = any, P = any> extends AppAction<T> {
  payload: P;
}

export interface BaseModel<I = number> {
  id: I;
  createdAt: any;
}

const rootReducer = combineReducers({
  environments: environmentsReducer,
});

export interface AppState {
  environments: EnvironmentState;
  [key: string]: any;
}

export const configureStore = () => {
  const logger = createLogger();
  return createStore(
    rootReducer,
    applyMiddleware(thunk, logger),
  );
};
