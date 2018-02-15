import { apiMiddleware } from 'redux-api-middleware-fixed';

export const getBaseMiddlewares = () => [apiMiddleware(fetch)];

export const getDevOnlyMiddlewares = () => {
  return process.env.NODE_ENV !== 'production'
    ? [require('redux-logger').createLogger({ collapsed: true })]
    : [];
};
