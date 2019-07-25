import { modelApi, PaginationOptions } from '../../lib/modelFetcher';
import { RecordModel } from '../models';
import { parseDates } from '../../lib/commonPipes';
import { PayloadAction } from '../index';
import { types, Types } from './reducer';
import { ThunkAction } from 'redux-thunk';

const Api = modelApi<RecordModel>('http://localhost:5000/environments/:parentId/records', [
  parseDates('time'),
]);

const setLoading = (bool: boolean): PayloadAction<Types['SET_RECORDS_LOADING'], boolean> => ({
  type: types.SET_RECORDS_LOADING,
  payload: bool,
});

const getRecordsSuccess = (id: string, records: RecordModel[]): PayloadAction<Types['GET_RECORDS_SUCCESS']> => ({
  type: types.GET_RECORDS_SUCCESS,
  payload: {id, records},
});

const getRecordsError = (error: any): PayloadAction<Types['GET_RECORDS_ERROR'], any> => ({
  type: types.GET_RECORDS_ERROR,
  payload: error,
});

export const getRecords = (envId: string, options?: PaginationOptions): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.getMany(options, envId)
    .then(records => dispatch(getRecordsSuccess(envId, records)))
    .catch(err => dispatch(getRecordsError(err)))
    .finally(() => dispatch(setLoading(false)));
};
