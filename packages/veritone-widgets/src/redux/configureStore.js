import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { getBaseMiddlewares, getDevOnlyMiddlewares } from './store';
import createRootReducer from './rootReducer';
import rootSaga from './rootSaga';

// Redux devtools browser extension hook
// this has no effect unless the user has the chrome devtools extension installed.
// https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      stateSanitizer: state => ({
        ...state,
        veritoneApp: '(omitted)'
      })
    })
  : compose;
const sagaMiddleware = createSagaMiddleware();

const enhancer = composeEnhancers(
  applyMiddleware(
    ...getBaseMiddlewares(),
    ...getDevOnlyMiddlewares(),
    sagaMiddleware
  )
);

function createReducer(asyncReducers) {
  return combineReducers({
    ...createRootReducer(),
    ...asyncReducers
  });
}

// runSaga is middleware.run function
// rootSaga is a your root saga for static saagas
function createSagaInjector(runSaga, rootSaga) {
  // Create a dictionary to keep track of injected sagas
  const injectedSagas = new Map();

  const isInjected = key => injectedSagas.has(key);

  const injectSaga = (key, saga) => {
    // We won't run saga if it is already injected
    if (isInjected(key)) {
      return;
    }

    // Sagas return task when they executed, which can be used
    // to cancel them
    const task = runSaga(saga);

    // Save the task if we want to cancel it in the future
    injectedSagas.set(key, task);
  };

  // Inject the root saga as it a staticlly loaded file,
  injectSaga('root', rootSaga);

  return injectSaga;
}

export default function configureStore(initialState) {
  const store = {
    ...createStore(createRootReducer(), initialState, enhancer),
    asyncReducers: {},
    runSaga: sagaMiddleware.run,
    sagaMiddleware
  };

  // Create an inject reducer function
  // This function adds the async reducer, and creates a new combined reducer
  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  };

  // Add injectSaga method to our store
  store.injectSaga = createSagaInjector(sagaMiddleware.run, rootSaga);

  store.runSaga(rootSaga);

  return store;
}
