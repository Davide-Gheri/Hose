import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { configureStore } from '../store';
import { CssBaseline, makeStyles, Snackbar, Button } from '@material-ui/core';
import { Route, Router, Switch } from 'react-router';
import { Main } from './Main';
import { NotificationsProvider, useNotifications } from '../contexts/Notifications';

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
  const styles = useStyles();
  const { message, closeNotification } = useNotifications();

  return (
    <Provider store={store}>
      <CssBaseline/>
      <div className={styles.root}>
        <Router history={history}>
          <Switch>
            <Route path="/" component={Main}/>
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
    </Provider>
  );
};

export default () => (
  <NotificationsProvider>
    <App/>
  </NotificationsProvider>
);
