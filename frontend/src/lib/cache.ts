import lru from '@davidegheri/lru';

const CACHE_ENABLED = true;

export const cache = lru(3);

(window as any).lru = cache;

export const setCache = (url: string, method: string) => (res: any) => {
  if (!CACHE_ENABLED) return res;
  if (method === 'GET') { // Cache only GET calls
    cache.set(url, res);
  } else { // Remove from cache for POST, PUT, PATCH, DELETE calls
    console.log('removing')
    cache.delete(url);
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
}));
