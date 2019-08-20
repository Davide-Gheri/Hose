import { AppState } from '../index';
import { makeAsArray, makeMakeById } from '../selectors';

const environmentsSelector = (state: AppState) => state.environments.environments;

export const asArray = makeAsArray(environmentsSelector);

export const makeByIdSelector = makeMakeById(environmentsSelector);
