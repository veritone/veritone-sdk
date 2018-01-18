import { combineReducers } from 'redux';
import { modules } from 'veritone-redux-common';

import filePickerReducer, {
  namespace as filePickerNamespace
} from './modules/filePicker';

const {
  user: { reducer: userReducer, namespace: userNamespace },
  config: { reducer: configReducer, namespace: configNamespace },
  auth: { reducer: authReducer, namespace: authNamespace },
} = modules;

export default function createReducer(asyncReducers) {
  return combineReducers({
    [filePickerNamespace]: filePickerReducer,
    [configNamespace]: configReducer,
    [userNamespace]: userReducer,
    [authNamespace]: authReducer,
    ...asyncReducers
  });
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
