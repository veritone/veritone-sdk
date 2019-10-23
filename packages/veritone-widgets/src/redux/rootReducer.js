import { playerReducer, operationReducer } from 'video-react';

import { combineReducers } from 'redux';
import { modules } from 'veritone-redux-common';
import { reducer as formReducer } from 'redux-form';

import filePickerReducer, {
  namespace as filePickerNamespace
} from './modules/filePicker';

import folderSelectionDialogReducer, {
  namespace as folderSelectionDialogNamespace
} from './modules/folderSelectionDialog';

import dataPickerReducer, {
  namespace as dataPickerNamespace
} from './modules/dataPicker';

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

import folderTreeReducer, {
  namespace as folderTreeNamespace
} from './modules/folder';

const {
  user: { reducer: userReducer, namespace: userNamespace },
  config: { reducer: configReducer, namespace: configNamespace },
  auth: { reducer: authReducer, namespace: authNamespace },
  engine: { reducer: engineReducer, namespace: engineNamespace }
} = modules;

import appReducer, { namespace as appNamespace } from './modules/veritoneApp';

export const reducers = {
  [filePickerNamespace]: filePickerReducer,
  [folderSelectionDialogNamespace]: folderSelectionDialogReducer,
  [dataPickerNamespace]: dataPickerReducer,
  [engineSelectionNamespace]: engineSelectionReducer,
  [notificationsNamespace]: notificationsReducer,
  [engineOutputExportNamespace]: engineOutputExportReducer,
  [configNamespace]: configReducer,
  [multipleEngineSelectionNamespace]: multipleEngineSelectionReducer,
  [userNamespace]: userReducer,
  [authNamespace]: authReducer,
  [appNamespace]: appReducer,
  [engineNamespace]: engineReducer,
  [folderTreeNamespace]: folderTreeReducer,
  player: playerReducer,
  operation: operationReducer,
  form: formReducer
};

export default function createReducer(asyncReducers) {
  return combineReducers({
    ...reducers,
    ...asyncReducers
  });
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
