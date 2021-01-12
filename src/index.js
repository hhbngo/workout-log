import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import authReducer from './store/reducers/auth';
import homeReducer from './store/reducers/home';
import './index.css';
import App from './App';

const rootReducer = combineReducers({
  auth: authReducer,
  home: homeReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
);
