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

export function callGraphQLApi({
  endpoint = 'https://api.veritone.com/v3/graphql',
  query,
  variables,
  operationName,
  token
}) {
  return fetch(endpoint, {
    method: 'post',
    body: JSON.stringify({
      query,
      variables,
      operationName
    }),
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(r => r.json());
}
