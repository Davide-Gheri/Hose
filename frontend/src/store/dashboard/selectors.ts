import { createSelector } from 'reselect';
import { AppState } from '../index';

export const preferredEnvSelector = (state: AppState) => state.dashboard.preferredEnv;

export const getPreferredEnv = createSelector(
  (state: AppState) => ({
    preferredId: state.dashboard.preferredEnv,
    environments: state.environments.environments,
  }),
  ({preferredId, environments}) => {
    if (preferredId) {
      return environments[preferredId] || null;
    }
    const envAsArray = Object.values(environments);
    if (envAsArray.length) {
      return envAsArray[0] || null;
    }
    return null;
  }
);
