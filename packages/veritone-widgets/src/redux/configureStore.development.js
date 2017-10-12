import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import {
  getBaseMiddlewares,
  getDevOnlyMiddlewares,
  getBaseStoreEnhancers,
  getDevOnlyStoreEnhancers
} from './store';
import createRootReducer from './reducer';
import rootSaga from './rootSaga';

// Redux devtools browser extension hook
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const enhancer = composeEnhancers(
  applyMiddleware(
    ...getBaseMiddlewares(),
    ...getDevOnlyMiddlewares(),
    sagaMiddleware
  ),
  ...getBaseStoreEnhancers(),
  ...getDevOnlyStoreEnhancers()
);

export default function configureStore(initialState) {
  const store = {
    ...createStore(createRootReducer(), initialState, enhancer),
    asyncReducers: {},
    runSaga: sagaMiddleware.run,
    sagaMiddleware
    // close: () => store.dispatch(END);
  };

  store.runSaga(rootSaga);

  // Enable hot module replacement for root reducers
  // if (__DEV__ && module.hot) {
  //   module.hot.accept('../reducer', () => {
  //     store.replaceReducer(createRootReducer(store.asyncReducers));
  //   });
  // }

  return store;
}
