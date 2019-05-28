import { select, call } from 'redux-saga/effects';
import { modules, helpers } from 'veritone-redux-common';

const { fetchGraphQLApi } = helpers;
const {
  auth: authModule,
  config: configModule,
} = modules;


function* getGqlParams() {
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

export function* fetchGraphQL(query) {
  const { graphQLUrl, token } = yield call(getGqlParams);
  const response = yield call(fetchGraphQLApi, {
    endpoint: graphQLUrl,
    query,
    token
  });
  return response;
}