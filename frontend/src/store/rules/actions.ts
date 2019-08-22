import { ThunkAction } from 'redux-thunk';
import { modelApi, PaginationOptions } from '../../lib/modelFetcher';
import { RuleModel } from '../models';
import { PayloadAction } from '../interfaces';
import { types, Types } from './reducer';

const Api = modelApi<RuleModel>('/rules');

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

const getRuleSuccess = (rule: RuleModel): PayloadAction<Types['GET_RULE_SUCCESS'], RuleModel> => ({
  type: types.GET_RULE_SUCCESS,
  payload: rule,
});

const getRuleError = (error: any): PayloadAction<Types['GET_RULE_ERROR'], any> => ({
  type: types.GET_RULE_ERROR,
  payload: error,
});

const deleteRuleSuccess = (id: string): PayloadAction<Types['DELETE_RULE_SUCCESS'], string> => ({
  type: types.DELETE_RULE_SUCCESS,
  payload: id,
});

export const getRules = (options?: PaginationOptions): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.getMany(options)
    .then(rules => dispatch(getRulesSuccess(rules)))
    .catch(err => {
      dispatch(getRulesError(err));
      throw err;
    })
    .finally(() => dispatch(setLoading(false)));
};

export const getRule = (id: string): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.get(id)
  .then(rule => dispatch(getRuleSuccess(rule)))
  .catch(err => {
    dispatch(getRuleError(err));
    throw err;
  })
  .finally(() => dispatch(setLoading(false)));
};

export const deleteRule = (id: string): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  dispatch(setLoading(true));
  return Api.delete(id)
    .then(() => dispatch(deleteRuleSuccess(id)))
    .finally(() => dispatch(setLoading(false)));
};

export const createRule = (data: Partial<RuleModel>): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  return Api.create(data)
    .then(rule => dispatch(getRuleSuccess(rule)))
    .catch(err => {
      dispatch(getRuleError(err));
      throw err;
    });
};

export const updateRule = (id: string, data: Partial<RuleModel>): ThunkAction<Promise<any>, {}, {}, PayloadAction> => dispatch => {
  return Api.update(id, data)
    .then(rule => dispatch(getRuleSuccess(rule)))
    .catch(err => {
      dispatch(getRuleError(err));
      throw err;
    });
};
