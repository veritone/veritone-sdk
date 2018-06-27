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

export async function callGraphQL({
  actionTypes: [requestType, successType, failureType],
  query,
  variables,
  operationName,
  bailout = constant(false),
  dispatch,
  getState
}) {
  if (!isFunction(dispatch) || !isFunction(getState)) {
    throw new Error('callGraphQLApi requires dispatch and getState functions')
  }

  const state = getState();
  const config = getConfig(state);
  const endpoint = `${config.apiRoot}/${config.graphQLEndpoint}`;
  const token = selectOAuthToken(state) || selectSessionToken(state);

  const shouldBail = bailout(state);
  if (shouldBail) {
    return;
  }

  dispatch({ type: requestType, meta: { variables, operationName, query } });

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({
        query,
        variables,
        operationName
      }),
      headers: {
        Authorization: token ? `bearer ${token}` : null,
        'Content-Type': 'application/json'
      }
    }).then(r => r.json());
  } catch (e) {
    dispatch({
      type: failureType,
      error: true,
      payload: e,
      meta: { variables, operationName, query }
    });

    let error = new Error('API call failed');
    error.errors = [e];
    return error;
  }

  if (response.errors && response.errors.length) {
    dispatch({
      type: failureType,
      error: true,
      payload: response.errors,
      meta: { variables, operationName, query }
    });

    let error = new Error('API response included errors');
    error.errors = response.errors;
    return error;
  }

  dispatch({
    type: successType,
    payload: response.data,
    meta: { variables, operationName, query }
  });

  return response.data;
}
