import { modelApi, PaginationOptions } from '../../lib/modelFetcher';
import { RecordModel } from '../models';
import { parseDates } from '../../lib/commonPipes';
import { PayloadAction } from '../index';
import { types, Types } from './reducer';
import { ThunkAction } from 'redux-thunk';
import { WateringModel } from '../models/watering.model';

const Api = modelApi<WateringModel>('http://localhost:5000/environments/:parentId/waterings', [
  parseDates('createdAt', 'processedAt'),
]);

const setLoading = (bool: boolean): PayloadAction<Types['SET_WATERINGS_LOADING'], boolean> => ({
  type: types.SET_WATERINGS_LOADING,
  payload: bool,
});

const getWateringsSuccess = (id: string, waterings: WateringModel[]): PayloadAction<Types['GET_WATERINGS_SUCCESS']> => ({
  type: types.GET_WATERINGS_SUCCESS,
  payload: {id, waterings},
});

const getWateringsError = (error: any): PayloadAction<Types['GET_WATERINGS_ERROR'], any> => ({
  type: types.GET_WATERINGS_ERROR,
  payload: error,
});

export const getWaterings = (envId: string, options?: PaginationOptions): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.getMany(options, envId)
    .then(waterings => dispatch(getWateringsSuccess(envId, waterings)))
    .catch(err => dispatch(getWateringsError(err)))
    .finally(() => dispatch(setLoading(false)));
};
