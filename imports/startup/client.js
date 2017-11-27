import React from 'react';
import ReactDOM from 'react-dom';

import { onPageLoad } from 'meteor/server-render';

import App from '/imports/ui/app';

import { createStore } from 'redux'
import appStore from '/imports/redux/reducers/index.js';
import { Provider } from 'react-redux';

/* eslint-disable no-underscore-dangle */
const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

let store = createStore(
  appStore, 
  preloadedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
/* eslint-enable */

onPageLoad(() => {
  ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('app'));
});