import { AppState } from '../index';
import { makeAsArray } from '../selectors';

export const boardsSelector = (state: AppState) => state.boards.boards;

export const asArray = makeAsArray(boardsSelector);
