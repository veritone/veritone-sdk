import {
  promiseMiddleware as main,
  WAIT_FOR_ACTION,
  ERROR_ACTION,
  CALLBACK_ARGUMENT,
  CALLBACK_ERROR_ARGUMENT
} from './promiseMiddleware';

export const promiseMiddleware = {
  main,
  WAIT_FOR_ACTION,
  ERROR_ACTION,
  CALLBACK_ARGUMENT,
  CALLBACK_ERROR_ARGUMENT
};

export { createReducer, reduceReducers } from './reducer';
export handleApiCall from './handleApiCall';
export fetchingStatus from './fetchingStatus';
