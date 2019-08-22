import React, { Suspense, useEffect } from 'react';
import { createBrowserHistory } from 'history';
import { CssBaseline, makeStyles, Snackbar, Button, MuiThemeProvider } from '@material-ui/core';
import { Route, Router, Switch } from 'react-router';
import { Main } from './Main';
import { NotificationsProvider, useNotifications } from '../contexts/Notifications';
import { getCurrentFull, getThemes } from '../store/theme';
import { useSelector } from 'react-redux';
import { useThunkDispatch } from '../store';
import { getLoadingError } from '../store/selectors';
import { Loading } from './Loading';
import { Error } from './Error';

const history = createBrowserHistory();

const App: React.FC = () => {
  const styles = useStyles();
  const { message, closeNotification } = useNotifications();

  return (
    <>
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
    </>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: (theme.palette.background as any).level1 || '#ffffff',
    height: '100%',
  },
  '@global': {
    fieldset: {
      appearance: 'none',
      border: 'none',
      padding: 0,
      margin: 0,
    },
    body: {
      backgroundColor: theme.palette.background.default || '#ffffff',
      height: '100%',
    },
    html: {
      height: '100%',
    }
  }
}));

export default () => {
  const currentTheme = useSelector(getCurrentFull);
  const {loading, error} = useSelector(getLoadingError('themes'));
  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(getThemes());
  }, []); // eslint-disable-line

  useEffect(() => {
    (window as any).theme = currentTheme;
  }, [currentTheme]);

  if (loading || !currentTheme) {
    return <Loading/>;
  }

  if (error) {
    return <Error/>;
  }

  return (
    <Suspense fallback={<Loading/>}>
      <NotificationsProvider>
        <MuiThemeProvider theme={currentTheme}>
          <CssBaseline />
          <App/>
        </MuiThemeProvider>
      </NotificationsProvider>
    </Suspense>
  )
};
