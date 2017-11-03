import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import {
  getBaseMiddlewares,
  getProductionOnlyMiddlewares,
  getBaseStoreEnhancers,
  getProductionOnlyStoreEnhancers
} from './store';
import createRootReducer from './rootReducer';
import rootSaga from './rootSaga';

// Redux devtools browser extension hook
// this has no effect unless the user has the chrome devtools extension installed.
// https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const enhancer = composeEnhancers(
  applyMiddleware(
    ...getBaseMiddlewares(),
    ...getProductionOnlyMiddlewares(),
    sagaMiddleware
  ),
  ...getBaseStoreEnhancers(),
  ...getProductionOnlyStoreEnhancers()
);

export default function configureStore(initialState) {
  const store = createStore(createRootReducer(), initialState, enhancer);
  store.asyncReducers = {};
  store.runSaga = sagaMiddleware.run;
  store.sagaMiddleware = sagaMiddleware;

  store.runSaga(rootSaga);

  return store;
}
