import React  from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { Loading } from './components/Loading';
import { bootstrap } from './bootstrap';
import { StoreAndPersisor } from './store';
import { Config } from './lib/Config';

bootstrap()
  .then(({store, persistor}: StoreAndPersisor) => {
    ReactDOM.render((
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Loading/>}>
          <App/>
        </PersistGate>
      </Provider>
    ), document.getElementById(Config.get<string>('rootId', 'root')));
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
