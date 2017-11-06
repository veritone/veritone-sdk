import { combineReducers } from 'redux';

import { modules } from 'veritone-redux-common';

const {
  user: { reducer: userReducer, namespace: userNamespace },
  config: { reducer: configReducer, namespace: configNamespace }
} = modules;

export default function createReducer(asyncReducers) {
  return combineReducers({
    [configNamespace]: configReducer,
    [userNamespace]: userReducer,
    ...asyncReducers
  });
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
