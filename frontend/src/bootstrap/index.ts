import { setAutoFreeze } from 'immer';
import { Config } from '../lib/Config';
import { LoggerManager } from '../lib/logger';
import { configureReducer, configureStore, StoreAndPersisor } from '../store';
import { bootI18n } from './i18n';

export function bootstrap(): Promise<StoreAndPersisor> {
  setAutoFreeze(false);
  LoggerManager.enabled = Config.get<boolean>('logger.enabled');
  return Promise.resolve()
    .then(bootI18n)
    .then(configureReducer)
    .then(configureStore);
}
