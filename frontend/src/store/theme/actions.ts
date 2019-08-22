import { modelApi } from '../../lib/modelFetcher';
import { WateringModel } from '../models/watering.model';
import { PayloadAction } from '../interfaces';
import { types, Types } from './reducer';
import { ThunkAction } from 'redux-thunk';

const Api = modelApi<WateringModel>('/themes');

const setLoading = (bool: boolean): PayloadAction<Types['SET_THEMES_LOADING'], boolean> => ({
  type: types.SET_THEMES_LOADING,
  payload: bool,
});

const getThemesSuccess = (themes: Record<string, any>): PayloadAction<Types['GET_THEMES_SUCCESS']> => ({
  type: types.GET_THEMES_SUCCESS,
  payload: themes,
});

const getThemesError = (error: any): PayloadAction<Types['GET_THEMES_ERROR'], any> => ({
  type: types.GET_THEMES_ERROR,
  payload: error,
});

export const _setCurrentTheme = (name: string): PayloadAction<Types['SET_THEMES_CURRENT'], string> => ({
  type: types.SET_THEMES_CURRENT,
  payload: name,
});

export const setCurrentTheme = (name: string): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  return Promise.resolve()
    .then(() => {
      dispatch({
        type: types.SET_THEMES_CURRENT,
        payload: name,
      });
      localStorage.setItem('hose_currentTheme', name);
    });
};

export const getThemes = (): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.getMany()
  .then(themes => dispatch(getThemesSuccess(themes)))
  .catch(err => {
    dispatch(getThemesError(err));
    throw err;
  })
  .finally(() => dispatch(setLoading(false)));
};
