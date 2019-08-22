import { createMuiTheme } from '@material-ui/core/styles';
import { firebaseBase } from './base';

const darkPalette = {
  type: 'dark',
  primary: {
    contrastText: 'rgba(0, 0, 0, 0.87)',
    light: 'rgb(166, 212, 250)',
    main: '#90caf9',
    dark: 'rgb(100, 141, 174)',
  },
  secondary: {
    contrastText: 'rgba(0, 0, 0, 0.87)',
    dark: 'rgb(170, 100, 123)',
    light: 'rgb(246, 165, 192)',
    main: '#f48fb1',
  },
  error: {
    contrastText: '#fff',
    dark: '#d32f2f',
    light: '#e57373',
    main: '#f44336',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  background: {
    default: '#121212',
    level1: '#212121',
    level2: '#333',
    paper: '#424242',
  },
  text: {
    disabled: 'rgba(255, 255, 255, 0.5)',
    hint: 'rgba(255, 255, 255, 0.5)',
    icon: 'rgba(255, 255, 255, 0.5)',
    primary: '#fff',
    secondary: 'rgba(255, 255, 255, 0.7)',
  },
}

export let firebaseDark = createMuiTheme({
  ...firebaseBase,
  palette: darkPalette,
});

firebaseDark.overrides = {
  ...firebaseDark.overrides,
  MuiAppBar: {
    colorPrimary: {
      backgroundColor: darkPalette.background.level2,
      color: firebaseDark.palette.getContrastText(darkPalette.background.level2),
    }
  }
};
