import produce from 'immer';
import { RecordModel } from '../models';
import { PayloadAction } from '../index';

export interface RecordsState {
  loading: boolean;
  error: any;
  records: Record<string, RecordModel[]>;
}

export const types = {
  SET_RECORDS_LOADING: 'SET_RECORDS_LOADING',
  GET_RECORDS_SUCCESS: 'GET_RECORDS_SUCCESS',
  GET_RECORDS_ERROR: 'GET_RECORDS_ERROR',
};

export type Types = typeof types;

const initialState: RecordsState = {
  loading: false,
  error: null,
  records: {},
};

export function reducer(state: RecordsState = initialState, action: PayloadAction): RecordsState {
  return produce(state, draft => {
    switch (action.type) {
      case types.SET_RECORDS_LOADING:
        draft.loading = action.payload;
        break;
      case types.GET_RECORDS_ERROR:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case types.GET_RECORDS_SUCCESS:
        draft.loading = false;
        draft.error = null;
        if (action.reset) {
          draft.records[action.payload.id] = action.payload.records;
        } else {
          draft.records[action.payload.id] = [
            ...draft.records[action.payload.id] || [],
            ...action.payload.records,
          ];
        }
        break;
    }
  })
}
