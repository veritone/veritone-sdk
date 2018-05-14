import { apiMiddleware } from 'redux-api-middleware-fixed';
import thunkMiddleware from 'redux-thunk';
import { helpers } from 'veritone-redux-common';
const { promiseMiddleware } = helpers;

export const getBaseMiddlewares = () => [
  apiMiddleware(fetch),
  promiseMiddleware.main(),
  thunkMiddleware
];

export const getDevOnlyMiddlewares = () => {
  return process.env.NODE_ENV !== 'production'
    ? [require('redux-logger').createLogger({ collapsed: true })]
    : [];
};
