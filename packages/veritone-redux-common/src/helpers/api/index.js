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
