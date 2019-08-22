import lru from '@davidegheri/lru';
import { sleep } from './sleep';

const CACHE_ENABLED = true;

export const cache = lru(3);

(window as any).lru = cache;

export const setCache = (url: string, method: string) => (res: any) => {
  if (!CACHE_ENABLED) return res;
  if (method === 'GET') { // Cache only GET calls
    cache.set(url, res);
  } else {
    // Clear ALL cache if not a GET request (related entities could have embedded the same requested object, now obsolete)
    cache.reset();
    // cache.delete(url);
  }
  return res;
};

export const getFromCache = (url: string, options: RequestInit = {method: 'GET'}) => new Promise(((resolve, reject) => {
  if (CACHE_ENABLED && options.method === 'GET' && cache.has(url)) {
    const cached = cache.get(url);
    resolve(cached);
  } else {
    reject();
  }
})).then(sleep(100));
