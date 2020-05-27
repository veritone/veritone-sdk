import { getCredentialsMode } from './';

export default function fetchGraphQLApi({
  endpoint = 'https://api.veritone.com/v3/graphql',
  extraHeaders = {},
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
      Authorization: token ? `Bearer ${token}` : null,
      'Content-Type': 'application/json',
      ...extraHeaders
    },
    credentials: getCredentialsMode()
  }).then(r => r.json());
}
