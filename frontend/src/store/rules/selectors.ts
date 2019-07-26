import { createSelector } from 'reselect';
import { AppState } from '../index';

const rulesSelector = (state: AppState) => state.rules.rules;

export const asArray = createSelector(
  rulesSelector,
  rules => Object.keys(rules).map(id => rules[id]),
);
