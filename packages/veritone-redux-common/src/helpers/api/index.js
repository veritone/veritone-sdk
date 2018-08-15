import { selectSessionToken, selectOAuthToken } from 'modules/auth';

export function commonHeaders(state) {
  const OAuthToken = selectOAuthToken(state);
  const sessionToken = selectSessionToken(state);

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
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
  return isVeritoneInternalApp ? 'include' : 'omit';
}
