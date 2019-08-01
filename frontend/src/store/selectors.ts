import { createSelector } from 'reselect';
import { AppState, BaseModel } from './index';

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
