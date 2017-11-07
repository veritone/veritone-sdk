import { apiMiddleware } from 'redux-api-middleware-fixed';

export const getBaseMiddlewares = () => [apiMiddleware(fetch)];

export const getDevOnlyMiddlewares = () => {
  if (process.env.NODE_ENV !== 'production') {
    return [
      require('redux-validate-fsa')(),
      require('redux-immutable-state-invariant').default(),
      require('redux-logger').createLogger({ collapsed: true })
    ];
  }
};

export const getProductionOnlyMiddlewares = () => [];

export const getBaseStoreEnhancers = () => [];

export const getDevOnlyStoreEnhancers = () => {
  if (process.env.NODE_ENV !== 'production') {
    // By default we try to read the key from ?debug_session=<key> in the address bar
    const getDebugSessionKey = function() {
      const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
      return matches && matches.length ? matches[1] : null;
    };

    return [
      // Lets you write ?debug_session=<key> in address bar to persist debug sessions
      require('redux-devtools').persistState(getDebugSessionKey())
    ];
  }
};

export const getProductionOnlyStoreEnhancers = () => [];
