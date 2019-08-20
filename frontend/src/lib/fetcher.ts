import { sleep } from './sleep';
import { getFromCache, setCache } from './cache';
import { makeLogger } from './logger';

const debug = true; // TODO from env or config

const logger = makeLogger('fetcher', true);

const headers: Record<string, string> = {
  'content-type': 'application/json'
};

export const setHeader = (name: string, value: string | null) => {
  if (value) {
    headers[name] = value;
  } else {
    delete headers[name];
  }
};

export const get = <T = any>(url: string) => callFetch<T>(url, {method: 'GET'});

export const post = <T = any>(url: string, body?: any) => callFetch<T>(url, optionsWithBody('POST', body));

export const patch = <T = any>(url: string, body?: any) => callFetch<T>(url, optionsWithBody('PATCH', body));

export const put = <T = any>(url: string, body?: any) => callFetch<T>(url, optionsWithBody('PUT', body));

export const del = (url: string) => callFetch(url, {method: 'DELETE'});

const callFetch = <T = any>(url: string, options?: RequestInit) => {
  return getFromCache(url, options)
    .then(res => {
      logger.log('Cache HIT');
      return res;
    })
    .catch(() => {
      logger.log('Cache miss');
      return fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options || {}).headers,
        },
      })
      .then(logResponse)
      .then(parseResponse)
      .then(setCache(url, options!.method || 'GET'))
    })
    .then(sleep(500)) // TODO remove this
};

const optionsWithBody = (method: string, body?: any) => Object.assign({
  method,
}, body && {body: JSON.stringify(body)});

const logResponse = (res: Response) => {
  if (debug) logger.log(res);
  return res;
};

const parseResponse = (res: Response) => {
  return res.json()
    .then(json => {
      if (!res.ok) {
        console.log(json);
        throw new FetchError(json);
      }
      return json;
    });
};

export class FetchError extends Error {
  public description: any;
  public statusCode: number;

  constructor(errorObj: any) {
    super(errorObj.message || 'An error occurred');

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }
    this.name = 'FetchError';
    this.description = errorObj;
    this.statusCode = errorObj.statusCode || 500;
  }
}
