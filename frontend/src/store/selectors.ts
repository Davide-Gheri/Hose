import { createSelector } from 'reselect';
import { AppState } from './index';

export const getLoading = (store: string) => createSelector(
  (state: AppState) => state[store],
  store => store.loading,
);
