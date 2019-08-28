import lru from '@davidegheri/lru';
import { debugSleep, sleep } from './sleep';
import { makeLogger } from './logger';
import { Config } from './Config';

const CACHE_ENABLED = Config.get<boolean>('fetch.cache');

export const cache = lru(3);

if (process.env.NODE_ENV !== 'production') {
  (window as any).lru = cache;
}

const logger = makeLogger('cache', Config.get<boolean>('logger.loggers.cache'));

export const setCache = (url: string, method: string) => (res: any) => {
  if (!CACHE_ENABLED) {
    logger.debug('Cache not enabled, skipping');
    return res;
  }
  if (method === 'GET') { // Cache only GET calls
    logger.debug('GET method, caching call', [url, res]);
    cache.set(url, res);
  } else {
    logger.debug(`${method} method, not cacheable, clearing cache`, url);
    // Clear ALL cache if not a GET request (related entities could have embedded the same requested object, now obsolete)
    cache.reset();
    // cache.delete(url);
  }
  return res;
};

export const getFromCache = (url: string, options: RequestInit = {method: 'GET'}) => new Promise(((resolve, reject) => {
  if (CACHE_ENABLED && options.method === 'GET' && cache.has(url)) {
    logger.debug('Cache entry found', [url, options]);
    const cached = cache.get(url);
    resolve(cached);
  } else {
    logger.debug(!CACHE_ENABLED ? 'Cache disabled' : options.method !== 'GET' ? `${options.method} method not cacheable` : 'Cache entry not found', [url, options]);
    reject();
  }
}))
.then(debugSleep(100));
