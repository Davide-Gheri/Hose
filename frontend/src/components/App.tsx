import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { configureStore } from '../store';
import { CssBaseline, makeStyles } from '@material-ui/core';
import { Route, Router, Switch } from 'react-router';
import { Main } from './Main';

const history = createBrowserHistory();
const store = configureStore();

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  }
}));

const App: React.FC = () => {
  const styles = useStyles();
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
    </Provider>
  );
};

export default App;
