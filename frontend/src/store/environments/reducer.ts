import produce from 'immer';
import { PayloadAction } from '../index';
import { EnvironmentModel } from '../models';

export interface EnvironmentState {
  environments: {
    [key: string]: EnvironmentModel;
  },
  loading: boolean;
  error: any;
}

export const types = {
  SET_LOADING: 'SET_LOADING',
  GET_ENVS_SUCCESS: 'GET_ENVS_SUCCESS',
  GET_ENVS_ERROR: 'GET_ENVS_ERROR',
  GET_ENV_SUCCESS: 'GET_ENV_SUCCESS',
  GET_ENV_ERROR: 'GET_ENV_ERROR',
};

export type Types = typeof types;

const initialState: EnvironmentState = {
  environments: {},
  loading: false,
  error: null,
};

export function reducer(state: EnvironmentState = initialState, action: PayloadAction) {
  return produce(state, draft => {
    switch (action.type) {
      case types.SET_LOADING:
        draft.loading = action.payload;
        break;
      case types.GET_ENVS_SUCCESS:
        draft.loading = false;
        draft.error = null;
        action.payload.forEach((env: EnvironmentModel) => {
          draft.environments[env.id] = env;
        });
        break;
      case types.GET_ENVS_ERROR:
        draft.loading = false;
        draft.error = action.payload;
        draft.environments = {};
        break;
      case types.GET_ENV_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.environments[action.payload.id] = action.payload;
        break;
      case types.GET_ENV_ERROR:
        draft.loading = false;
        draft.error = action.payload;
        break;
    }
  });
}
