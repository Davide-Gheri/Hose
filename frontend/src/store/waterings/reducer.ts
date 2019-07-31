import produce from 'immer';
import { WateringModel } from '../models/watering.model';
import { PayloadAction } from '../index';

export interface WateringState {
  loading: boolean;
  error: any;
  waterings: Record<string, WateringModel[]>;
}

export const types = {
  SET_WATERINGS_LOADING: 'SET_WATERINGS_LOADING',
  GET_WATERINGS_SUCCESS: 'GET_WATERINGS_SUCCESS',
  GET_WATERINGS_ERROR: 'GET_WATERINGS_ERROR',
};

export type Types = typeof types;

const initialState: WateringState = {
  loading: false,
  error: null,
  waterings: {},
};

export function reducer(state: WateringState = initialState, action: PayloadAction): WateringState {
  return produce(state, draft => {
    switch (action.type) {
      case types.SET_WATERINGS_LOADING:
        draft.loading = action.payload;
        break;
      case types.GET_WATERINGS_ERROR:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case types.GET_WATERINGS_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.waterings[action.payload.id] = [
          ...draft.waterings[action.payload.id] || [],
          ...action.payload.waterings,
        ];
        break;
    }
  })
}
