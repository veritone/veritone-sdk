import { fork, all, call, put, takeEvery, select } from 'redux-saga/effects';
import { get, uniq } from 'lodash';
import { modules } from 'veritone-redux-common';
import * as engineResults from '.';
import { getEngineResultsQuery } from './queries';

import callGraphQLApi from '../../../shared/callGraphQLApi';

const { auth: authModule, config: configModule } = modules;


function* loadEngineResults(widgetId, tdo, engineId, startOffsetMs, stopOffsetMs) {
  const config = yield select(configModule.getConfig);
  const token = yield select(authModule.selectSessionToken);

  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const variables = {
    tdoId: tdo.id,
    engineIds: [engineId]
  };

  if (startOffsetMs) {
    variables.startOffsetMs = startOffsetMs;
  }
  if (stopOffsetMs) {
    variables.stopOffsetMs = stopOffsetMs;
  }

  let response;
  try {
    yield put(engineResults.isFetchingEngineResults(widgetId));

    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: getEngineResultsQuery,
      variables: variables,
      token
    });

    yield put(engineResults.fetchEngineResultsSuccess(response));
  } catch (error) {
    yield put(engineResults.fetchEngineResultsFailure(null, { error, widgetId }));
  } finally {
    yield put(engineResults.doneFetchingEngineResults(widgetId));
  }
}

function* onMount(tdo, selectedEngineId) {
  yield call(loadEngineResults, tdo, selectedEngineId);
}

export default function* root({ tdo, selectedEngineId }) {
  yield all([
    fork(onMount, tdo, selectedEngineId)
  ]);
}
