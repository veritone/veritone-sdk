import { playerReducer, operationReducer } from 'video-react';

import { combineReducers } from 'redux';
import { modules } from 'veritone-redux-common';
import { reducer as formReducer } from 'redux-form';

import filePickerReducer, {
  namespace as filePickerNamespace
} from './modules/filePicker';

import engineSelectionReducer, {
  namespace as engineSelectionNamespace
} from './modules/engineSelection';

import multipleEngineSelectionReducer, {
  namespace as multipleEngineSelectionNamespace
} from './modules/multipleEngineSelection';

import notificationsReducer, {
  namespace as notificationsNamespace
} from './modules/notifications';

import engineOutputExportReducer, {
  namespace as engineOutputExportNamespace
} from './modules/engineOutputExport';

// import dataPickerReducer, { namespace as dataPickerNamespace } from './modules/dataPicker';

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
    [engineOutputExportNamespace]: engineOutputExportReducer,
    [configNamespace]: configReducer,
    [multipleEngineSelectionNamespace]: multipleEngineSelectionReducer,
    [userNamespace]: userReducer,
    [authNamespace]: authReducer,
    [appNamespace]: appReducer,
    [engineNamespace]: engineReducer,
    // [dataPickerNamespace]: dataPickerReducer,
    player: playerReducer,
    operation: operationReducer,
    form: formReducer,
    ...asyncReducers
  });
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
