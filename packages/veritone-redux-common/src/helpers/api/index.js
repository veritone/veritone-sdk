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
  const origin = (window && window.origin) || '';
  // app.veritone.com on port 80 in prod, or
  // ie. local.veritone.com on any port in dev
  const isVeritoneInternalApp = origin.match(/\.veritone\.com(:\d{1,5})?$/);
  const isAiwareAnywhereInternalApp = origin.match(/\.aiware\.com(:\d{1,5})?$/);
  return (isVeritoneInternalApp || isAiwareAnywhereInternalApp) ? 'include' : 'omit';
}
