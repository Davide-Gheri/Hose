import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { configureStore } from '../store';
import { CssBaseline, makeStyles, Snackbar, Button, createMuiTheme } from '@material-ui/core';
import { Route, Router, Switch } from 'react-router';
import { Main } from './Main';
import { NotificationsProvider, useNotifications } from '../contexts/Notifications';
import { ThemeProvider } from '@material-ui/styles';
import { firebase } from '../theme';

const history = createBrowserHistory();
const store = configureStore();

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  '@global': {
    fieldset: {
      appearance: 'none',
      border: 'none',
      padding: 0,
      margin: 0,
    },
  }
}));

const App: React.FC = () => {
  const [theme, setTheme] = useState(firebase);
  const styles = useStyles();
  const { message, closeNotification } = useNotifications();

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={styles.root}>
          <Router history={history}>
            <Switch>
              <Route path="/" component={Main} />
            </Switch>
          </Router>
        </div>
        {message && (
          <Snackbar
            open={true}
            anchorOrigin={{
              vertical: message.vertical,
              horizontal: message.horizontal,
            }}
            message={message.text}
            autoHideDuration={message.autoHide as number}
            onClose={closeNotification}
            action={message.action ? (
              <Button color="secondary" size="small" onClick={message.action.onClick}>
                {message.action.text}
              </Button>
            ) : null}
          />
        )}
      </ThemeProvider>
    </Provider>
  );
};

export default () => (
  <NotificationsProvider>
    <App/>
  </NotificationsProvider>
);
