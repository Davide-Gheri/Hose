import qs from 'qs';
import { Config } from './Config';
import { get, del, patch, post } from './fetcher';
import { isAbsoluteUrl, runPipes, removeTrailingSlash } from './util';

export interface PaginationOptions {
  skip?: number;
  take?: number;
  [key: string]: any;
}

const baseApiUrl = Config.get<string>('fetch.apiUrl');

const PARENT_PLACEHOLDER = ':parentId';

const formatUrl = (baseUrl: string, id: string | null | undefined, parentId?: string, trailing?: string): string => {
  let base  = baseUrl;
  if (parentId) {
    base = base.replace(PARENT_PLACEHOLDER, parentId);
  }
  if (id) {
    base = removeTrailingSlash(base) + '/' + id;
  }
  return removeTrailingSlash(base) + (trailing ? `/${removeTrailingSlash(trailing)}` : '');
};

const addQuerystring = (url: string, options?: PaginationOptions): string => {
  if (!options || !Object.keys(options).length) {
    return url;
  }
  const toString = qs.stringify(options);

  return `${url}${toString ? `?${toString}` : ''}`;
};

export const modelApi = <T = any>(baseUrl: string, pipes: Function[] = []) => {
  if (!isAbsoluteUrl(baseUrl)) {
    baseUrl = baseApiUrl + baseUrl;
  }
  const pipesCallback = runPipes(pipes);
  return {
    getMany: (options?: PaginationOptions, parentId?: string) =>
      get<T[]>(addQuerystring(formatUrl(baseUrl, null, parentId), options)).then(pipesCallback) as Promise<T[]>,

    get: (id: string, parentId?: string) =>
      get<T>(formatUrl(baseUrl, id, parentId)).then(pipesCallback) as Promise<T>,

    create: (body: any, parentId?: string) =>
      post<T>(formatUrl(baseUrl, null, parentId), body).then(pipesCallback) as Promise<T>,

    update: (id: string, body: any, parentId?: string) =>
      patch<T>(formatUrl(baseUrl, id, parentId), body).then(pipesCallback) as Promise<T>,

    delete: (id: string, parentId?: string) =>
      del(formatUrl(baseUrl, id, parentId)).then(pipesCallback),
  }
};
