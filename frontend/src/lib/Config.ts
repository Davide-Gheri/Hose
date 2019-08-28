import get from 'lodash/get';
import merge from 'lodash/merge';

export interface ConfigPersist {
  dbName: string;
}

export interface ConfigI18n {
  backendUrl: string;
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
  private defaultConfigObj: ConfigObject = require('../config/default.json');

  private mergedConfig: ConfigObject;

  constructor(
    private environment?: string,
  ) {
    this.mergedConfig = merge(
      this.defaultConfigObj,
      this.getCurrentEnvConfig(),
    );
  }

  private getCurrentEnvConfig(): Partial<ConfigObject> {
    try {
      return require(`../config/${this.environment}.json`);
    } catch (e) {
      console.warn(e.message);
      return {};
    }
  }

  get<T = any>(key: string, fallback: any = null): T {
    let value = get(this.mergedConfig, key, fallback);
    if (typeof value === 'function') {
      value = value(this.mergedConfig);
    }
    return value;
  }
}

export const Config = new ConfigManager(process.env.NODE_ENV);
