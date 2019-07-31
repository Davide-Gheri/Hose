import { createSelector } from 'reselect';
import { AppState } from '../index';

const wateringsSelector = (state: AppState) => state.waterings.waterings;

export const makeGetByEnvSelector = () => createSelector(
  wateringsSelector,
  (_: any, id: string) => id,
  (waterings, id) => waterings[id] || [],
);
