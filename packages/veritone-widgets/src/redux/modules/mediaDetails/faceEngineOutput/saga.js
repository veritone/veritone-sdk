import { fork, all, call, put, takeEvery, select } from 'redux-saga/effects';
import { get, isUndefined } from 'lodash';
import { modules } from 'veritone-redux-common';
import * as engineResults from '.';
import * as gqlQuery from './queries';

import callGraphQLApi from '../../../../shared/callGraphQLApi';

const { auth: authModule, config: configModule } = modules;

const token = 'f8cf9030-d4e9-40c5-a5f2-dba963861285';
const graphQLUrl = "https://api.veritone.com/v3/graphql";

function* loadEngineResults(tdo, engineId, startOffsetMs, stopOffsetMs) {
  const config = yield select(configModule.getConfig);
  // const token = yield select(authModule.selectSessionToken);

  const { apiRoot, graphQLEndpoint } = config;
  // const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const variables = {
    tdoId: tdo.id,
    engineIds: [engineId]
  };

  const meta = {
    engineId,
    startOffsetMs,
    stopOffsetMs,
  };

  if (!isUndefined(startOffsetMs)) {
    variables.startOffsetMs = startOffsetMs;
  }
  if (!isUndefined(stopOffsetMs)) {
    variables.stopOffsetMs = stopOffsetMs;
  }

  try {
    yield put(engineResults.fetchingEngineResults(meta));

    const response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: gqlQuery.getEngineResultsQuery,
      variables: variables,
      token
    });

    yield put(engineResults.fetchEngineResultsSuccess(response, meta));
  } catch (error) {
    yield put(engineResults.fetchEngineResultsFailure(error, meta));
  } finally {
    yield put(engineResults.doneFetchingEngineResults(meta));
  }
}

function* fetchEntities(entityIds) {
  const entityQueries = gqlQuery.getEntities(entityIds);
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  // const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  // const token = yield select(authModule.selectSessionToken);

  try {
    const response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: `query{${entityQueries.join(' ')}}`,
      token
    });

    yield put(engineResults.fetchEntitiesSuccess(response, { entityIds }));
  } catch (error) {
    yield put(engineResults.fetchEntitiesFailure(error, { entityIds }));
  }
}

function* fetchLibraries(action) {
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  // const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  // const token = yield select(authModule.selectSessionToken);
  const { libraryType } = action.payload;

  try {
    const response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: gqlQuery.getLibrariesByType,
      variables: { type: libraryType },
      token
    });

    yield put(engineResults.fetchLibrariesSuccess(response, { libraryType }));
  } catch (error) {
    yield put(engineResults.fetchLibrariesFailure(error, { libraryType }));
  }
}

function* createNewEntity(action) {
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  // const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  // const token = yield select(authModule.selectSessionToken);
  const { meta } = action;

  try {
    const response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: gqlQuery.createEntity,
      variables: { input: action.payload },
      token
    });

    yield put(engineResults.createEntitySuccess(response,  meta));
  } catch (error) {
    yield put(engineResults.createEntityFailure(error, meta));
  }
}

function* onMount(tdo, selectedEngineId) {
  yield call(
    loadEngineResults,
    tdo,
    selectedEngineId,
    0,
    Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime)
  );
}

function* watchFetchEngineResults() {
  yield takeEvery(
    (action) => action.type === engineResults.FETCH_ENGINE_RESULTS_SUCCESS,
    function* (action) {
      const entityIds = {};

      if (!action.payload.errors) {
        const engineResults = get(action.payload.data, 'engineResults.records');
        if (engineResults) {
          engineResults.forEach(engineResult => {
            engineResult.jsondata.series.forEach(s => {
              const entityId = get(s, 'object.entityId');
              if (entityId) {
                // entityIds.push(entityId);
                entityIds[entityId] = true;
              }
            });
          });
        }
      }

      yield call(fetchEntities, Object.keys(entityIds));
    }
  )
}

function* watchFetchLibraries() {
  yield takeEvery(
    (action) => action.type === engineResults.FETCH_LIBRARIES,
    fetchLibraries
  )
}

function* watchCreateEntity() {
  yield takeEvery(
    (action) => action.type === engineResults.CREATE_ENTITY,
    createNewEntity
  )
}

export default function* root({ tdo, selectedEngineId }) {
  yield all([
    fork(onMount, tdo, selectedEngineId),
    fork(watchFetchEngineResults),
    fork(watchFetchLibraries),
    fork(watchCreateEntity)
  ]);
}
