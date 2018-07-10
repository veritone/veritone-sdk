import uiStateReducer, * as uiStateModule from './ui-state';
export const uiState = {
  reducer: uiStateReducer,
  ...uiStateModule
};

import userReducer, * as userModule from './user';
import * as userConstants from './user/constants';

export const user = {
  reducer: userReducer,
  ...userModule,
  ...userConstants
};

import configReducer, * as configModule from './config';
export const config = {
  reducer: configReducer,
  ...configModule
};

import authRootSaga from './auth/oauthSaga';
import authReducer, * as authModule from './auth';
import * as authConstants from './auth/constants';

export const auth = {
  reducer: authReducer,
  ...authModule,
  ...authConstants,
  authRootSaga
};

import engineReducer, * as engineModule from './engine';
export const engine = {
  reducer: engineReducer,
  ...engineModule
};

import applicationReducer, * as applicationModule from './application';
export const application = {
  reducer: applicationReducer,
  ...applicationModule
};

import confirmationRootSaga from './confirmation/saga';
import confirmationReducer, * as confirmationModule from './confirmation';

export const confirmation = {
  reducer: confirmationReducer,
  ...confirmationModule,
  confirmationRootSaga
};

import engineResultsReducer, * as engineResultsModule from './engineResults';
export const engineResults = {
  reducer: engineResultsReducer,
  ...engineResultsModule
};
