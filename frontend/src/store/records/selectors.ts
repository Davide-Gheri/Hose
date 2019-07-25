import { createSelector } from 'reselect';
import { AppState } from '../index';

const recordsSelector = (state: AppState) => state.records.records;

export const makeGetByEnvSelector = () => createSelector(
  recordsSelector,
  (_: any, id: string) => id,
  (records, id) => records[id] || [],
);
