import get from 'lodash/get';

export interface ConfigPersist {
  dbName: string;
}

export interface ConfigI18n {
  defaultLanguage: string;
  fallbackLanguage: string;
  currentLanguageKey: string;
  cache: {
    storeName: string;
    [key: string]: any;
  }
}

export interface ConfigRedux {
  persist: string[];
}

export interface ConfigLogger {
  enabled: boolean;
  loggers: Record<'redux' | 'fetch' | string, boolean>;
}

export interface ConfigFetch {
  apiUrl: string;
}

export interface ConfigObject {
  appName: string;
  rootId: string;
  persist: ConfigPersist;
  i18n: ConfigI18n;
  redux: ConfigRedux;
  logger: ConfigLogger;
  fetch: ConfigFetch;
}

class ConfigManager {
  constructor(
    private configObj: ConfigObject,
  ) {}

  get<T = any>(key: string, fallback: any = null): T {
    let value = get(this.configObj, key, fallback);
    if (typeof value === 'function') {
      value = value(this.configObj);
    }
    return value;
  }
}

export const Config = new ConfigManager(require('../config/default.json'));
