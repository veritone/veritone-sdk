import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { video } from 'veritone-react-common';
import { modules } from 'veritone-redux-common';

const { playerReducer, operationReducer } = video;

import filePickerReducer, {
  namespace as filePickerNamespace
} from './modules/filePicker';

import mediaDetailsReducer, {
  namespace as mediaDetailsNamespace
} from './modules/mediaDetails';

import transcriptReducer, { transcriptNamespace } from './modules/mediaDetails/transcriptWidget';
import faceEngineOutputReducer, {
  namespace as faceEngineOutputNamespace
} from './modules/mediaDetails/faceEngineOutput';

const {
  user: { reducer: userReducer, namespace: userNamespace },
  config: { reducer: configReducer, namespace: configNamespace },
  auth: { reducer: authReducer, namespace: authNamespace },
  application: { reducer: applicationReducer, namespace: applicationNamespace }
} = modules;

import appReducer, { namespace as appNamespace } from './modules/veritoneApp';

export default function createReducer(asyncReducers) {
  return combineReducers({
    [filePickerNamespace]: filePickerReducer,
    [mediaDetailsNamespace]: mediaDetailsReducer,
    [transcriptNamespace]: transcriptReducer,
    [faceEngineOutputNamespace]: faceEngineOutputReducer,
    [configNamespace]: configReducer,
    [userNamespace]: userReducer,
    [authNamespace]: authReducer,
    [appNamespace]: appReducer,
    [applicationNamespace]: applicationReducer,
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
