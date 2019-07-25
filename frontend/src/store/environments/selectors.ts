import { createSelector } from 'reselect';
import { AppState } from '../index';

const environmentsSelector = (state: AppState) => state.environments.environments;

export const asArray = createSelector(
  environmentsSelector,
  envs => Object.keys(envs).map(id => envs[id]),
);

export const makeByIdSelector = () => createSelector(
  environmentsSelector,
  (_: any, id: string) => id,
  (envs, id) => envs[id]
);
