import { createSelector } from 'reselect';
import { AppState } from './index';
import { BaseModel } from './interfaces';

export const getLoading = (store: string) => createSelector(
  (state: AppState) => state[store],
  store => store.loading,
);

export const getError = (store: string) => createSelector(
  (state: AppState) => state[store],
  store => store.error,
);

export const getLoadingError = (store: string) => createSelector(
  (state: AppState) => state[store],
  store => ({
    loading: store.loading,
    error: store.error,
  }),
);

export const makeAsArray = <M extends BaseModel<any> = any>(storeSelector: (store: AppState) => Record<string, M>) => createSelector(
  storeSelector,
  models => Object.keys(models).map(id => models[id]),
);

export const makeMakeById = <M extends BaseModel<any> = any>(storeSelector: (store: AppState) => Record<string, M>) => () => createSelector(
  storeSelector,
  (_: any, id: string) => id,
  (models, id) => models[id]
);
