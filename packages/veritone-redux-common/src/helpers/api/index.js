import { selectSessionToken, selectOAuthToken } from 'modules/auth';

import { getExtraHeaders } from '../../modules';

export function commonHeaders(state) {
  const OAuthToken = selectOAuthToken(state);
  const sessionToken = selectSessionToken(state);
  const extraHeaders = getExtraHeaders(state) || {};

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...extraHeaders
  };

  if (OAuthToken || sessionToken) {
    headers.Authorization = `Bearer ${OAuthToken || sessionToken}`;
  }

  return headers;
}

export function getCredentialsMode() {
  return 'include';
}
