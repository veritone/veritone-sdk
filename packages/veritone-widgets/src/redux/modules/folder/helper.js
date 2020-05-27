import { select, call } from 'redux-saga/effects';
import { modules, helpers } from 'veritone-redux-common';

const { fetchGraphQLApi } = helpers;
const {
  auth: authModule,
  config: configModule,
  getExtraHeaders
} = modules;

export function* getGqlParams() {
  const config = yield select(configModule.getConfig);
  const extraHeaders = yield select(getExtraHeaders);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const sessionToken = yield select(authModule.selectSessionToken);
  const oauthToken = yield select(authModule.selectOAuthToken);
  const token = sessionToken || oauthToken;
  return {
    graphQLUrl,
    token,
    extraHeaders
  };
}


export function* handleRequest({ query, variables }) {
  const { graphQLUrl, token, extraHeaders } = yield call(getGqlParams);
  let response;
  try {
    response = yield call(fetchGraphQLApi, {
      endpoint: graphQLUrl,
      query,
      variables,
      extraHeaders,
      token
    });
    if (response.errors) {
      throw new Error(response.errors)
    }
  } catch (error) {
    console.log('error', error)
    return {
      error,
    }
  }

  return {
    error: null,
    response
  };
}
