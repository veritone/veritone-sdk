import {
  select
} from 'redux-saga/effects';
import { modules } from 'veritone-redux-common';
const {
  auth: authModule,
  config: configModule,
  getExtraHeaders
} = modules;

export const ROOT_ID = 'root';
export const DEFAULT_PAGE_SIZE = 30;
export const TDO_FRAGMENTS = `
  id
  name
  startDateTime
  stopDateTime
  thumbnailUrl
  sourceImageUrl
  primaryAsset (assetType: "media") {
    id
    name
    contentType
    signedUri
  }
  createdDateTime
  modifiedDateTime
  streams {
    uri
    protocol
  }
`;

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
