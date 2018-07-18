export default function fetchGraphQLApi({
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
