import { AppState } from '../index';
import { makeAsArray, makeMakeById } from '../selectors';

const rulesSelector = (state: AppState) => state.rules.rules;

export const asArray = makeAsArray(rulesSelector);

export const makeByIdSelector = makeMakeById(rulesSelector);
