import qs from 'qs';
import { get, del, patch, post } from './fetcher';

export interface PaginationOptions {
  skip?: number;
  take?: number;
}

const ID_PLACEHOLDER = ':id';
const PARENT_PLACEHOLDER = ':parentId';

const replacePlaceholders = (baseUrl: string, id: string | null, parentId?: string): string => {
  let replaced = baseUrl;
  if (id) {
    replaced = replaced.replace(ID_PLACEHOLDER, id);
  }
  if (parentId) {
    replaced = replaced.replace(PARENT_PLACEHOLDER, parentId);
  }
  return replaced;
};

const addQuerystring = (url: string, options?: PaginationOptions): string => {
  if (!options) {
    return url;
  }
  const toString = qs.stringify(options);
  return `${url}?${toString}`;
};

export const modelApi = <T = any>(baseUrl: string, pipes: Function[] = []) => {
  const pipesCallback = runPipes(pipes);
  return {
    getMany: (options?: PaginationOptions, parentId?: string) => get<T[]>(addQuerystring(replacePlaceholders(baseUrl, null, parentId), options)).then(pipesCallback) as Promise<T[]>,
    get: (id: string, parentId?: string) => get<T>(replacePlaceholders(baseUrl, id, parentId)).then(pipesCallback) as Promise<T>,
    create: (body: any, parentId?: string) => post<T>(replacePlaceholders(baseUrl, null, parentId)).then(pipesCallback) as Promise<T>,
    update: (id: string, body: any, parentId?: string) => patch<T>(replacePlaceholders(baseUrl, id, parentId), body).then(pipesCallback) as Promise<T>,
    delete: (id: string, parentId?: string) => del(replacePlaceholders(baseUrl, id, parentId)).then(pipesCallback),
  }
};


const runPipes = (pipes: Function[]) => async (res: any) => {
  let newRes = res;
  for (const pipe of pipes) {
    newRes = await pipe(newRes);
  }
  return newRes;
};
