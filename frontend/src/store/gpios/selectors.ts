import { createSelector } from 'reselect';
import { AppState } from '../index';

const gpiosSelector = (state: AppState) => state.gpios.gpios;

export const asArray = createSelector(
  gpiosSelector,
  gpios => Object.keys(gpios).map(id => gpios[id]),
);
