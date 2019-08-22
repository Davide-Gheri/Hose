import produce from 'immer';
import { PayloadAction } from '../interfaces';

export interface ThemeState {
  loading: boolean;
  error: any;
  themes: Record<string, any>;
  currentName: string | null;
}

export const types = {
  SET_THEMES_LOADING: 'SET_THEMES_LOADING',
  GET_THEMES_SUCCESS: 'GET_THEMES_SUCCESS',
  GET_THEMES_ERROR: 'GET_THEMES_ERROR',
  SET_THEMES_CURRENT: 'SET_THEMES_CURRENT',
};

export type Types = typeof types;

const initialState: ThemeState = {
  loading: false,
  error: null,
  themes: {},
  currentName: null,
};

export function reducer(state: ThemeState = initialState, action: PayloadAction): ThemeState {
  return produce(state, draft => {
    switch (action.type) {
      case types.SET_THEMES_LOADING:
        draft.loading = action.payload;
        break;
      case types.GET_THEMES_ERROR:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case types.GET_THEMES_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.themes = action.payload;
        break;
      case types.SET_THEMES_CURRENT:
        draft.currentName = action.payload;
    }
  });
}
