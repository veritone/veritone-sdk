import { select } from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const {
  auth: authModule,
  config: configModule,
  user: userModule
} = modules;


export function* getGqlParams() {
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const sessionToken = yield select(authModule.selectSessionToken);
  const oauthToken = yield select(authModule.selectOAuthToken);
  const token = sessionToken || oauthToken;
  return {
    graphQLUrl,
    token
  };
}
