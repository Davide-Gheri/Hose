import produce from 'immer';
import { RuleModel } from '../models';
import { PayloadAction } from '../index';

export interface RulesState {
  loading: boolean;
  error: any;
  rules: Record<string, RuleModel>;
}

export const types = {
  SET_RULES_LOADING: 'SET_RULES_LOADING',
  GET_RULES_SUCCESS: 'GET_RULES_SUCCESS',
  GET_RULES_ERROR: 'GET_RULES_ERROR',
};

export type Types = typeof types;

const initialState: RulesState = {
  rules: {},
  loading: false,
  error: null,
};

export function reducer(state: RulesState = initialState, action: PayloadAction): RulesState {
  return produce(state, draft => {
    switch (action.type) {
      case types.SET_RULES_LOADING:
        draft.loading = action.payload;
        break;
      case types.GET_RULES_ERROR:
        draft.loading = false;
        draft.error = action.payload;
        draft.rules = {};
        break;
      case types.GET_RULES_SUCCESS:
        draft.loading = false;
        draft.error = null;
        action.payload.forEach((rule: RuleModel) => {
          draft.rules[rule.id] = rule;
        });
        break;
    }
  });
}
