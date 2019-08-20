import { createMuiTheme } from '@material-ui/core/styles';
import { firebaseBase } from './base';

export let firebaseLight = createMuiTheme({
  ...firebaseBase,
  palette: {
    type: 'light',
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
});
