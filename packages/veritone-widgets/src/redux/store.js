import { apiMiddleware } from 'redux-api-middleware-fixed';
import thunkMiddleware from 'redux-thunk';

export const getBaseMiddlewares = () => [apiMiddleware(fetch), thunkMiddleware];

export const getDevOnlyMiddlewares = () => {
  return process.env.NODE_ENV !== 'production'
    ? [require('redux-logger').createLogger({ collapsed: true })]
    : [];
};
