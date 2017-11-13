/*
** Comment me
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './store'
import Root from './routing/index';


ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
	<Root />
      </ConnectedRouter>
    </Provider>
, document.getElementById('body'));
