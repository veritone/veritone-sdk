import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { video } from 'veritone-react-common';
import { modules } from 'veritone-redux-common';

const { playerReducer, operationReducer } = video;

import filePickerReducer, {
  namespace as filePickerNamespace
} from './modules/filePicker';

import engineSelectionReducer, {
  namespace as engineSelectionNamespace
} from './modules/engineSelection';

import notificationsReducer, {
  namespace as notificationsNamespace
} from './modules/notifications';

import mediaDetailsReducer, {
  namespace as mediaDetailsNamespace
} from './modules/mediaDetails';

import transcriptReducer, {
  transcriptNamespace
} from './modules/mediaDetails/transcriptWidget';
import faceEngineOutputReducer, {
  namespace as faceEngineOutputNamespace
} from './modules/mediaDetails/faceEngineOutput';

import savedSearchReducer, {
  namespace as savedSearchNamespace
} from './modules/savedSearch';

import engineOutputExportReducer, {
  namespace as engineOutputExportNamespace
} from './modules/engineOutputExport';

import mediaPlayerReducer, {
  namespace as mediaPlayerNamespace
} from './modules/mediaPlayer';

const {
  user: { reducer: userReducer, namespace: userNamespace },
  config: { reducer: configReducer, namespace: configNamespace },
  auth: { reducer: authReducer, namespace: authNamespace },
  engine: { reducer: engineReducer, namespace: engineNamespace },
  application: { reducer: applicationReducer, namespace: applicationNamespace },
  engineResults: {
    reducer: engineResultsReducer,
    namespace: engineResultsNamespace
  }
} = modules;

import appReducer, { namespace as appNamespace } from './modules/veritoneApp';

export default function createReducer(asyncReducers) {
  return combineReducers({
    [filePickerNamespace]: filePickerReducer,
    [engineSelectionNamespace]: engineSelectionReducer,
    [notificationsNamespace]: notificationsReducer,
    [mediaDetailsNamespace]: mediaDetailsReducer,
    [transcriptNamespace]: transcriptReducer,
    [faceEngineOutputNamespace]: faceEngineOutputReducer,
    [engineOutputExportNamespace]: engineOutputExportReducer,
    [configNamespace]: configReducer,
    [userNamespace]: userReducer,
    [authNamespace]: authReducer,
    [appNamespace]: appReducer,
    [engineNamespace]: engineReducer,
    [applicationNamespace]: applicationReducer,
    [savedSearchNamespace]: savedSearchReducer,
    [engineResultsNamespace]: engineResultsReducer,
    [mediaPlayerNamespace]: mediaPlayerReducer,
    form: formReducer,
    player: playerReducer,
    operation: operationReducer,
    ...asyncReducers
  });
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}
