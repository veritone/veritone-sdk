import { playerReducer, operationReducer } from 'video-react';

import { combineReducers } from 'redux';
import { modules } from 'veritone-redux-common';

import filePickerReducer, {
  namespace as filePickerNamespace
} from './modules/filePicker';

import engineSelectionReducer, {
  namespace as engineSelectionNamespace
} from './modules/engineSelection';

import notificationsReducer, {
  namespace as notificationsNamespace
} from './modules/notifications';

const {
  user: { reducer: userReducer, namespace: userNamespace },
  config: { reducer: configReducer, namespace: configNamespace },
  auth: { reducer: authReducer, namespace: authNamespace },
  engine: { reducer: engineReducer, namespace: engineNamespace }
} = modules;

import appReducer, { namespace as appNamespace } from './modules/veritoneApp';

export default function createReducer(asyncReducers) {
  return combineReducers({
    [filePickerNamespace]: filePickerReducer,
    [engineSelectionNamespace]: engineSelectionReducer,
    [notificationsNamespace]: notificationsReducer,
    [configNamespace]: configReducer,
    [userNamespace]: userReducer,
    [authNamespace]: authReducer,
    [appNamespace]: appReducer,
    [engineNamespace]: engineReducer,
    player: playerReducer,
    operation: operationReducer,
    ...asyncReducers
  });
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
