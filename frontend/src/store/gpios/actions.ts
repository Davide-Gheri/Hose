import { ThunkAction } from 'redux-thunk';
import { modelApi, PaginationOptions } from '../../lib/modelFetcher';
import { GpioModel } from '../models';
import { PayloadAction } from '../interfaces';
import { types, Types } from './reducer';

const Api = modelApi<GpioModel>('/gpios');

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

const getGpioSuccess = (gpio: GpioModel): PayloadAction<Types['GET_GPIO_SUCCESS'], GpioModel> => ({
  type: types.GET_GPIO_SUCCESS,
  payload: gpio,
});

const getGpioError = (error: any): PayloadAction<Types['GET_GPIO_ERROR'], any> => ({
  type: types.GET_GPIO_ERROR,
  payload: error,
});

const deleteGpioSuccess = (id: string): PayloadAction<Types['DELETE_GPIO_SUCCESS'], string> => ({
  type: types.DELETE_GPIO_SUCCESS,
  payload: id,
});

export const getGpios = (options?: PaginationOptions): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.getMany(options)
    .then(rules => dispatch(getGpiosSuccess(rules)))
    .catch(err => {
      dispatch(getGpiosError(err));
      throw err;
    })
    .finally(() => dispatch(setLoading(false)));
};

export const createGpio = (data: Partial<GpioModel>): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  return Api.create(data)
    .then(gpio => dispatch(getGpioSuccess(gpio)))
    .catch(err => {
      throw err;
    });
};

export const deleteGpio = (id: string): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  console.log('Deleting gpio');
  dispatch(setLoading(true));
  return Api.delete(id)
    .then(() => dispatch(deleteGpioSuccess(id)))
    .finally(() => {
      console.log('set loading FALSE from finally()')
      dispatch(setLoading(false))
    });
};
