import { sleep } from './sleep';
import { getFromCache, setCache } from './cache';

const debug = true; // TODO from env or config

const headers = new Headers();

export const setHeader = (name: string, value: string | null) => {
  if (value) {
    headers.set(name, value);
  } else {
    headers.delete(name);
  }
};

export const get = <T = any>(url: string) => callFetch<T>(url, {method: 'GET'});

export const post = <T = any>(url: string, body?: any) => callFetch<T>(url, optionsWithBody('POST', body));

export const patch = <T = any>(url: string, body?: any) => callFetch<T>(url, optionsWithBody('PATCH', body));

export const put = <T = any>(url: string, body?: any) => callFetch<T>(url, optionsWithBody('PUT', body));

export const del = (url: string) => callFetch(url, {method: 'DELETE'});

const callFetch = <T = any>(url: string, options?: RequestInit) => {
  return getFromCache(url)
    .then(res => {
      console.log('Cache HIT');
      console.log({...res});
      return res;
    })
    .catch(() => {
      console.log('Cache miss');
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
    .then(sleep(2000)) // TODO remove this
};

const optionsWithBody = (method: string, body?: any) => Object.assign({
  method,
}, body && {body: JSON.stringify(body)});

const logResponse = (res: Response) => {
  if (debug) console.log(res);
  return res;
};

const parseResponse = (res: Response) => {
  return res.json();
};
