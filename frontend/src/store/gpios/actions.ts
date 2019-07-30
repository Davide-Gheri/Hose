import { ThunkAction } from 'redux-thunk';
import { modelApi, PaginationOptions } from '../../lib/modelFetcher';
import { GpioModel } from '../models';
import { PayloadAction } from '../index';
import { types, Types } from './reducer';

const Api = modelApi<GpioModel>('http://localhost:5000/gpios');

const setLoading = (bool: boolean): PayloadAction<Types['SET_GPIOS_LOADING'], boolean> => ({
  type: types.SET_GPIOS_LOADING,
  payload: bool,
});

const getGpiosSuccess = (gpios: GpioModel[]): PayloadAction<Types['GET_GPIOS_SUCCESS'], GpioModel[]> => ({
  type: types.GET_GPIOS_SUCCESS,
  payload: gpios,
});

const getGpiosError = (error: any): PayloadAction<Types['GET_GPIOS_ERROR'], any> => ({
  type: types.GET_GPIOS_ERROR,
  payload: error,
});

export const getGpios = (options?: PaginationOptions): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.getMany(options)
  .then(rules => dispatch(getGpiosSuccess(rules)))
  .catch(err => dispatch(getGpiosError(err)))
  .finally(() => dispatch(setLoading(false)));
};
