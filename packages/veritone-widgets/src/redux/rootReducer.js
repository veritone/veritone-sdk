import { combineReducers } from 'redux';

import { modules } from 'veritone-redux-common';
const { user, namespace: userNamespace } = modules;

export default function createReducer(asyncReducers) {
  return combineReducers({
    [userNamespace]: user,
    fixme: a => ({}),
    ...asyncReducers
  });
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
