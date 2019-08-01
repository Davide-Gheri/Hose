import { ThunkAction } from 'redux-thunk';
import { PayloadAction } from '../index';
import { types, Types } from './reducer';
import { modelApi, PaginationOptions } from '../../lib/modelFetcher';
import { parseDates } from '../../lib/commonPipes';
import { EnvironmentModel } from '../models';

const Api = modelApi<EnvironmentModel>('http://localhost:5000/environments', [
  parseDates(),
]);

const setLoading = (bool: boolean): PayloadAction<Types['SET_ENVS_LOADING'], boolean> => ({
  type: types.SET_ENVS_LOADING,
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

const deleteEnvironmentSuccess = (id: string): PayloadAction<Types['DELETE_ENV_SUCCESS'], string> => ({
  type: types.DELETE_ENV_SUCCESS,
  payload: id,
});

export const getEnvironments = (options?: PaginationOptions): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.getMany(options)
    .then(envs => dispatch(getEnvironmentsSuccess(envs)))
    .catch(err => {
      dispatch(getEnvironmentsError(err));
      throw err;
    })
    .finally(() => dispatch(setLoading(false)));
};

export const getEnvironment = (id: string): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.get(id)
    .then(env => dispatch(getEnvironmentSuccess(env)))
    .catch(err => {
      dispatch(getEnvironmentError(err));
      throw err;
    })
    .finally(() => dispatch(setLoading(false)));
};

export const createEnvironment = (data: Partial<EnvironmentModel>): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  return Api.create(data)
    .then(env => dispatch(getEnvironmentSuccess(env)))
    .catch(err => {
      dispatch(getEnvironmentError(err));
      throw err;
    });
};

export const updateEnvironment = (id: string, data: Partial<EnvironmentModel>): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  return Api.update(id, data)
    .then(env => dispatch(getEnvironmentSuccess(env)))
    .catch(err => {
      dispatch(getEnvironmentError(err));
      throw err;
    });
};

export const deleteEnvironment = (id: string): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.delete(id)
    .then(() => dispatch(deleteEnvironmentSuccess(id)))
    .finally(() => setLoading(false));
};
