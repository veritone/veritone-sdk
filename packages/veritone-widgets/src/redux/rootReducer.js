import { combineReducers } from 'redux';
import { modules } from 'veritone-redux-common';

import OAuthReducer, { namespace as OAuthNamespace } from './modules/oauth';
import filePickerReducer, {
  namespace as filePickerNamespace
} from './modules/filePicker';

const {
  user: { reducer: userReducer, namespace: userNamespace },
  config: { reducer: configReducer, namespace: configNamespace }
} = modules;

export default function createReducer(asyncReducers) {
  return combineReducers({
    [OAuthNamespace]: OAuthReducer,
    [filePickerNamespace]: filePickerReducer,
    [configNamespace]: configReducer,
    [userNamespace]: userReducer,
    ...asyncReducers
  });
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
