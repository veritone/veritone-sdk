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
