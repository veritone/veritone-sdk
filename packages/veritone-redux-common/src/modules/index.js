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

import librariesReducer, * as librariesModule from './libraries';
import * as librariesConstants from './libraries/constants';

export const libraries = {
  reducer: librariesReducer,
  ...librariesModule,
  ...librariesConstants
};
