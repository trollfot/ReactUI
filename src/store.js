
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';

import createHistory from 'history/createBrowserHistory'
import authReducer from './reducers/reducer_loggedin'
import flashReducer from './reducers/reducer_flashmessage'

// Create a history of your choosing
export const history = createHistory()


// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
export const store = createStore(
  combineReducers({
      authReducer,
      flashReducer,
      router: routerReducer
  }),
  applyMiddleware(thunk, routerMiddleware(history))
)
