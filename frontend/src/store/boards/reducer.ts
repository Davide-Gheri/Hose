import produce from 'immer';
import { BoardModel } from '../models';
import { PayloadAction } from '../interfaces';

export interface BoardsState {
  loading: boolean;
  error: any;
  boards: Record<string, BoardModel>;
}


export const types = {
  SET_BOARDS_LOADING: 'SET_BOARDS_LOADING',
  GET_BOARDS_SUCCESS: 'GET_BOARDS_SUCCESS',
  GET_BOARDS_ERROR: 'GET_BOARDS_ERROR',
  DELETE_BOARD_SUCCESS: 'DELETE_BOARD_SUCCESS',
  GET_BOARD_SUCCESS: 'GET_BOARD_SUCCESS',
  GET_BOARD_ERROR: 'GET_BOARD_ERROR',
};

export type Types = typeof types;

const initialState: BoardsState = {
  loading: false,
  error: null,
  boards: {},
};

export function reducer(state: BoardsState = initialState, action: PayloadAction): BoardsState {
  return produce(state, draft => {
    switch (action.type) {
      case types.SET_BOARDS_LOADING:
        draft.loading = action.payload;
        break;
      case types.GET_BOARDS_ERROR:
        draft.loading = false;
        draft.boards = {};
        draft.error = action.payload;
        break;
      case types.GET_BOARDS_SUCCESS:
        draft.loading = false;
        draft.error = null;
        action.payload.forEach((board: BoardModel) => {
          draft.boards[board.id] = board;
        });
        break;
      case types.DELETE_BOARD_SUCCESS:
        draft.loading = false;
        draft.error = false;
        delete draft.boards[action.payload];
        break;
      case types.GET_BOARD_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.boards[action.payload.id] = action.payload;
        break;
      case types.GET_BOARD_ERROR:
        draft.loading = false;
        draft.error = action.payload;
        break;
    }
  })
}
