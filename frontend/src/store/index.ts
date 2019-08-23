import { combineReducers, createStore, applyMiddleware, compose, Reducer, Store } from 'redux';
import { createLogger } from 'redux-logger';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import { Persistor } from 'redux-persist/es/types';
import localforage from 'localforage';
import { PayloadAction } from './interfaces';
import { Config } from '../lib/Config';
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
import { themesReducer } from './theme';
import { ThemeState } from './theme/reducer';
import { notificationsReducer } from './notifications';
import { NotificationState } from './notifications/reducer';

const DB_NAME = 'hose';

function makePersistConfig(name: string, blacklist = ['error', 'loading']) {
  const key = `${DB_NAME}_${name}`;
  return {
    key,
    blacklist,
    storage: localforage.createInstance({
      storeName: key,
      name: DB_NAME,
    }),
  }
}

export interface AppState {
  environments: EnvironmentState;
  records: RecordsState;
  rules: RulesState;
  gpios: GpiosState;
  waterings: WateringState;
  boards: BoardsState;
  themes: ThemeState;
  dashboard: DashboardState;
  notifications: NotificationState;
  [key: string]: any;
}

export interface StoreAndPersisor {
  store: Store<AppState>;
  persistor: Persistor;
}

export const configureReducer = (): Reducer<AppState> => {
  const toPersist = Config.get<string[]>('redux.persist', []);
  const reducers: any = {
    environments: environmentsReducer,
    records: recordsReducer,
    rules: rulesReducer,
    gpios: gpiosReducer,
    waterings: wateringsReducer,
    boards: boardsReducer,
    themes: themesReducer,
    dashboard: dashboardReducer,
    notifications: notificationsReducer,
  };
  return combineReducers<AppState>(Object.keys(reducers).reduce((obj, name) => {
    if (toPersist.includes(name)) {
      obj[name] = persistReducer(makePersistConfig(name), obj[name])
    }
    return obj;
  }, reducers));
};

export const configureStore = (reducer: Reducer<AppState>): StoreAndPersisor => {
  const logger = makeLogger('redux', Config.get<boolean>('logger.loggers.redux', false));
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const loggerMiddleware = createLogger({
    logger,
  });
  const middleware = applyMiddleware(thunk, loggerMiddleware);

  const store = createStore(
    reducer,
    composeEnhancers(middleware),
  );

  const persistor = persistStore(store);

  return { store, persistor };
};

export const useThunkDispatch = () => useDispatch<ThunkDispatch<{}, {}, PayloadAction>>();
