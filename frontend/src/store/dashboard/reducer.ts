import produce from 'immer';
import { PayloadAction } from '../interfaces';

export interface DashboardState {
  preferredEnv: string | null;
}

export const types = {
  SET_PREFERRED_ENV: 'SET_PREFERRED_ENV',
  GET_PREFERRED_ENV: 'GET_PREFERRED_ENV',
};

export type Types = typeof types;

const initialState: DashboardState = {
  preferredEnv: null,
};

export function reducer(state: DashboardState = initialState, action: PayloadAction) {
  return produce(state, draft => {
    switch (action.type) {
      case types.SET_PREFERRED_ENV:
        draft.preferredEnv = action.payload;
        break;
    }
  })
}
