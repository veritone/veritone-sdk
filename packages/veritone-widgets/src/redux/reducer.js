import { combineReducers } from 'redux';

// import application, {
//   namespace as applicationNamespace
// } from 'modules/application';

export default function createReducer(asyncReducers) {
  return combineReducers({
    // [applicationNamespace]: application,
    fixme: a => 'fixme',
    ...asyncReducers
  });
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
