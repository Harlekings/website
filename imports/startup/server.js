import React from 'react';
import { renderToString } from 'react-dom/server';
import { onPageLoad } from 'meteor/server-render';
import { Helmet } from 'react-helmet';

import { createStore } from 'redux';
import appStore from 'imports/redux/reducers';
import { Provider } from 'react-redux';

import App from '/imports/ui/app';

//import 'imports/api/data/publications';

onPageLoad((sink) => {

  const initialState = {
    counter: 69,
  };

  const store = createStore(
    appStore, 
    initialState,
  );

  sink.renderIntoElementById('app', renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  ));

  const helmet = Helmet.renderStatic();
  sink.appendToHead(helmet.meta.toString());
  sink.appendToHead(helmet.title.toString());

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')}
    </script>
  `);
});