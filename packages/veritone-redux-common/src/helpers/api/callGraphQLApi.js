import { constant, isFunction } from 'lodash';
import { getConfig } from '../../modules/config';
import { selectOAuthToken, selectSessionToken } from '../../modules/auth';
import fetchGraphQLApi from './fetchGraphQLApi';

async function callGraphQLApi({
  actionTypes: [requestType, successType, failureType],
  query,
  variables,
  operationName,
  bailout = constant(false),
  dispatch,
  getState
}) {
  if (!isFunction(dispatch) || !isFunction(getState)) {
    throw new Error('callGraphQLApi requires dispatch and getState functions');
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
    response = await fetchGraphQLApi({
      endpoint,
      query,
      variables,
      operationName,
      token
    });
  } catch (e) {
    dispatch({
      type: failureType,
      error: true,
      payload: e,
      meta: { variables, operationName, query }
    });

    let error = new Error('API call failed');
    // wrap this single error for consistency with graphQL errors, which are always
    // wrapped.
    error.errors = [e];
    throw error;
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
    throw error;
  }

  dispatch({
    type: successType,
    payload: response.data,
    meta: { variables, operationName, query }
  });

  return response.data;
}

export default callGraphQLApi;
