import { createSelector } from 'reselect';
import { AppState } from '../index';

const environmentsSelector = (state: AppState) => state.environments.environments;

export const asArray = createSelector(
  environmentsSelector,
  envs => Object.keys(envs).map(id => envs[id]),
);
