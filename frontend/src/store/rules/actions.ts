import { ThunkAction } from 'redux-thunk';
import { modelApi, PaginationOptions } from '../../lib/modelFetcher';
import { RuleModel } from '../models';
import { PayloadAction } from '../index';
import { types, Types } from './reducer';

const Api = modelApi<RuleModel>('http://localhost:5000/rules');

const setLoading = (bool: boolean): PayloadAction<Types['SET_RULES_LOADING'], boolean> => ({
  type: types.SET_RULES_LOADING,
  payload: bool,
});

const getRulesSuccess = (rules: RuleModel[]): PayloadAction<Types['GET_RULES_SUCCESS'], RuleModel[]> => ({
  type: types.GET_RULES_SUCCESS,
  payload: rules,
});

const getRulesError = (error: any): PayloadAction<Types['GET_RULES_ERROR'], any> => ({
  type: types.GET_RULES_ERROR,
  payload: error,
});

export const getRules = (options?: PaginationOptions): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.getMany(options)
    .then(rules => dispatch(getRulesSuccess(rules)))
    .catch(err => dispatch(getRulesError(err)))
    .finally(() => dispatch(setLoading(false)));
};
