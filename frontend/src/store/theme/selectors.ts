import { AppState } from '../index';
import { createSelector } from 'reselect';
import createMuiTheme, { Theme } from '@material-ui/core/styles/createMuiTheme';
import lru from '@davidegheri/lru';

const cache = lru(2);

const getFullTheme = (name: string, partialTheme: Partial<Theme> = {}) => {
  if (cache.has(name)) {
    return cache.get(name);
  }
  const theme = createMuiTheme({
    ...partialTheme,
  });
  cache.set(name, theme);

  return theme;
};

const themesSelector = (state: AppState) => state.themes.themes;

export const asNamesArray = createSelector(
  themesSelector,
  themes => Object.keys(themes),
);

export const getCurrentFull = createSelector(
  themesSelector,
  (state: AppState) => state.themes.currentName,
  (themes, current) => (current && themes[current]) ? getFullTheme(current, themes[current]) : getFullTheme('_base_'),
);
