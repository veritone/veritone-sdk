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
    ? [
        require('redux-logger').createLogger({
          collapsed: true
          // video-react fires a lot of actions; ignore them
          // predicate: (getState, action) => !action.type.startsWith('video-react')
        })
      ]
    : [];
};
