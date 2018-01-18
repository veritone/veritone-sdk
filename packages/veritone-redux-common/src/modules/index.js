import uiStateReducer, * as uiStateModule from './ui-state';
export const uiState = {
  reducer: uiStateReducer,
  ...uiStateModule
};

import userReducer, * as userModule from './user';
export const user = {
  reducer: userReducer,
  ...userModule
};

import configReducer, * as configModule from './config';
export const config = {
  reducer: configReducer,
  ...configModule
};

import authRootSaga from './auth/oauthSaga'
import authReducer, * as authModule from './auth';
export const auth = {
  reducer: authReducer,
  ...authModule,
  authRootSaga
};
