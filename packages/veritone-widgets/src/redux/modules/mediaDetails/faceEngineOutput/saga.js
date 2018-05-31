import { fork, all, call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { get, isUndefined } from 'lodash';
import { modules } from 'veritone-redux-common';
import * as faceEngineOutput from '.';
import * as gqlQuery from './queries';

import callGraphQLApi from '../../../../shared/callGraphQLApi';

const { auth: authModule, config: configModule } = modules;

// const token = 'fbc6364d-91d4-4c18-8fbb-b2992e432708';
// const graphQLUrl = "https://api.aws-dev.veritone.com/v3/graphql";

/* WATCH FUNCTIONS */
function* loadEngineResults(tdo, engineId, startOffsetMs, stopOffsetMs) {
  const config = yield select(configModule.getConfig);
  const token = yield select(authModule.selectSessionToken);

  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
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
    yield put(faceEngineOutput.fetchingEngineResults(meta));

    const response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: gqlQuery.getEngineResultsQuery,
      variables: variables,
      token
    });

    yield put(faceEngineOutput.fetchEngineResultsSuccess(response, meta));
  } catch (error) {
    yield put(faceEngineOutput.fetchEngineResultsFailure(error, meta));
  } finally {
    yield put(faceEngineOutput.doneFetchingEngineResults(meta));
  }
}

function* fetchEntities(entityIds) {
  const entityQueries = gqlQuery.getEntities(entityIds);
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  try {
    const response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: `query{${entityQueries.join(' ')}}`,
      token
    });

    yield put(faceEngineOutput.fetchEntitiesSuccess(response, { entityIds }));
  } catch (error) {
    yield put(faceEngineOutput.fetchEntitiesFailure(error, { entityIds }));
  }
}

function* fetchLibraries(action) {
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);
  const { libraryType } = action.payload;

  try {
    const response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: gqlQuery.getLibrariesByType,
      variables: { type: libraryType },
      token
    });

    yield put(faceEngineOutput.fetchLibrariesSuccess(response, { libraryType }));
  } catch (error) {
    yield put(faceEngineOutput.fetchLibrariesFailure(error, { libraryType }));
  }
}

function* createNewEntity(action) {
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);
  const { meta } = action;

  try {
    const response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: gqlQuery.createEntity,
      variables: { input: action.payload.entity },
      token
    });

    console.log('response:', response);

    if (response.errors) {
      return faceEngineOutput.createEntityFailure(response);
    }

    yield put(faceEngineOutput.updateEngineResultEntity(
      meta.selectedEngineId,
      meta.faceObj,
      response.data.entity
    ));

    // yield put(faceEngineOutput.createEntitySuccess(response,  meta));
  } catch (error) {
    yield put(faceEngineOutput.createEntityFailure(error, meta));
  }
}

function* searchForEntities(action) {
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);
  const { libraryType, searchText } = action.payload;

  const meta = {
    libraryType,
    searchText
  };

  try {
    if (!searchText) {
      return yield put(
        faceEngineOutput.fetchEntitySearchResultsSuccess({ data: [] }, meta)
      );
    }

    yield put(faceEngineOutput.fetchingEntitySearchResults());

    const response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: gqlQuery.searchForEntities,
      variables: {
        type: libraryType,
        name: searchText
      },
      token
    });

    yield put(faceEngineOutput.fetchEntitySearchResultsSuccess(response, meta));
  } catch (error) {
    yield put(faceEngineOutput.fetchEntitySearchResultsFailure(error, meta));
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

/* WATCHERS */

function* watchFetchEngineResultsSuccess() {
  yield takeEvery(
    (action) => action.type === faceEngineOutput.FETCH_ENGINE_RESULTS_SUCCESS,
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
    (action) => action.type === faceEngineOutput.FETCH_LIBRARIES,
    fetchLibraries
  )
}

function* watchCreateEntity() {
  yield takeEvery(
    (action) => action.type === faceEngineOutput.CREATE_ENTITY,
    createNewEntity
  )
}

function* watchSearchEntities() {
  yield takeLatest(
    (action) => action.type === faceEngineOutput.SEARCH_ENTITIES,
    searchForEntities
  )
}

function* watchFetchEngineResults() {
  yield takeEvery(
    (action) => action.type === faceEngineOutput.FETCH_ENGINE_RESULTS,
    function* (action) {
      const { tdo, selectedEngineId } = action.meta;
      yield call(
        loadEngineResults,
        tdo,
        selectedEngineId,
        0,
        Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime)
      )
    }
  );
}

export default function* root({ tdo, selectedEngineId }) {
  yield all([
    fork(onMount, tdo, selectedEngineId),
    fork(watchFetchEngineResults),
    fork(watchFetchEngineResultsSuccess),
    fork(watchFetchLibraries),
    fork(watchCreateEntity),
    fork(watchSearchEntities)
  ]);
}
