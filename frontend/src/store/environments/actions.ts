import { ThunkAction } from 'redux-thunk';
import { PayloadAction } from '../index';
import { types, Types } from './reducer';
import { modelApi, PaginationOptions } from '../../lib/modelFetcher';
import { parseDates } from '../../lib/commonPipes';
import { EnvironmentModel } from '../models';

const Api = modelApi<EnvironmentModel>('http://localhost:5000/environments', [
  parseDates(),
]);

const setLoading = (bool: boolean): PayloadAction<Types['SET_LOADING'], boolean> => ({
  type: types.SET_LOADING,
  payload: bool,
});

const getEnvironmentsSuccess = (envs: EnvironmentModel[]): PayloadAction<Types['GET_ENVS_SUCCESS'], EnvironmentModel[]> => ({
  type: types.GET_ENVS_SUCCESS,
  payload: envs,
});

const getEnvironmentsError = (error: any): PayloadAction<Types['GET_ENVS_ERROR'], any> => ({
  type: types.GET_ENVS_ERROR,
  payload: error,
});

const getEnvironmentSuccess = (env: EnvironmentModel): PayloadAction<Types['GET_ENV_SUCCESS'], EnvironmentModel> => ({
  type: types.GET_ENV_SUCCESS,
  payload: env,
});

const getEnvironmentError = (error: any): PayloadAction<Types['GET_ENV_ERROR'], any> => ({
  type: types.GET_ENV_ERROR,
  payload: error,
});

export const getEnvironments = (options?: PaginationOptions): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.getMany(options)
    .then(envs => dispatch(getEnvironmentsSuccess(envs)))
    .catch(err => dispatch(getEnvironmentsError(err)))
    .finally(() => dispatch(setLoading(false)));
};

export const getEnvironment = (id: string): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.get(id)
    .then(env => dispatch(getEnvironmentSuccess(env)))
    .catch(err => dispatch(getEnvironmentError(err)))
    .finally(() => dispatch(setLoading(false)));
};
