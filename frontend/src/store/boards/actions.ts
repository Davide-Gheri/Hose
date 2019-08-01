import { ThunkAction } from 'redux-thunk';
import { modelApi, PaginationOptions } from '../../lib/modelFetcher';
import { BoardModel, EnvironmentModel } from '../models';
import { PayloadAction } from '../index';
import { types, Types } from './reducer';
import { parseDates } from '../../lib/commonPipes';

const Api = modelApi<BoardModel>('http://localhost:5000/boards', [
  parseDates('createdAt', 'lastCheckedAt'),
]);

const setLoading = (bool: boolean): PayloadAction<Types['SET_BOARDS_LOADING'], boolean> => ({
  type: types.SET_BOARDS_LOADING,
  payload: bool,
});

const getBoardsSuccess = (boards: BoardModel[]): PayloadAction<Types['GET_BOARDS_SUCCESS'], BoardModel[]> => ({
  type: types.GET_BOARDS_SUCCESS,
  payload: boards,
});

const getBoardsError = (error: any): PayloadAction<Types['GET_BOARDS_ERROR'], any> => ({
  type: types.GET_BOARDS_ERROR,
  payload: error,
});

const deleteBoardSuccess = (id: string): PayloadAction<Types['DELETE_BOARD_SUCCESS'], string> => ({
  type: types.DELETE_BOARD_SUCCESS,
  payload: id,
});

const getBoardSuccess = (board: BoardModel): PayloadAction<Types['GET_BOARD_SUCCESS'], BoardModel> => ({
  type: types.GET_BOARD_SUCCESS,
  payload: board,
});

const getBoardError = (error: any): PayloadAction<Types['GET_BOARD_ERROR'], any> => ({
  type: types.GET_BOARD_ERROR,
  payload: error,
});

export const getBoards = (options?: PaginationOptions): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.getMany(options)
  .then(boards => dispatch(getBoardsSuccess(boards)))
  .catch(err => {
    dispatch(getBoardsError(err));
    throw err;
  })
  .finally(() => dispatch(setLoading(false)));
};

export const createBoard = (data: Partial<BoardModel>): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  return Api.create(data)
  .then(board => dispatch(getBoardSuccess(board)))
  .catch(err => {
    dispatch(getBoardError(err));
    throw err;
  });
};

export const updateBoard = (id: string, data: Partial<EnvironmentModel>): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  return Api.update(id, data)
  .then(board => dispatch(getBoardSuccess(board)))
  .catch(err => {
    dispatch(getBoardError(err));
    throw err;
  });
};

export const deleteBoard = (id: string): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.delete(id)
    .then(() => dispatch(deleteBoardSuccess(id)))
    .finally(() => dispatch(setLoading(false)));
};
