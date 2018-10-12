import {
  fork,
  all,
  call,
  put,
  takeEvery,
  takeLatest,
  select
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { get, isEmpty } from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
// TODO: refactor to use callGraphQLApi
const { fetchGraphQLApi } = helpers;

import * as faceEngineOutput from '.';
import { CANCEL_EDIT } from '../index';
import * as gqlQuery from './queries';

const {
  auth: authModule,
  config: configModule,
  engineResults: engineResultsModule
} = modules;

/* WATCH FUNCTIONS */
function* fetchEntities(entityIds) {
  const entityQueries = gqlQuery.getEntities(entityIds);
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  try {
    const response = yield call(fetchGraphQLApi, {
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
    const response = yield call(fetchGraphQLApi, {
      endpoint: graphQLUrl,
      query: gqlQuery.getLibrariesByType,
      variables: { type: libraryType },
      token
    });

    yield put(
      faceEngineOutput.fetchLibrariesSuccess(response, { libraryType })
    );
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
    const response = yield call(fetchGraphQLApi, {
      endpoint: graphQLUrl,
      query: gqlQuery.createEntity,
      variables: { input: action.payload.entity },
      token
    });

    if (response.errors) {
      return faceEngineOutput.createEntityFailure(response);
    }

    yield put(
      faceEngineOutput.addDetectedFace(
        meta.selectedEngineId,
        meta.faceObj,
        response.data.entity
      )
    );
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
    yield delay(400);

    const response = yield call(fetchGraphQLApi, {
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
  yield put(
    engineResultsModule.fetchEngineResults({
      tdo: tdo,
      engineId: selectedEngineId,
      startOffsetMs: 0,
      stopOffsetMs:
        Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime),
      ignoreUserEdited: false
    })
  );
}

/* WATCHERS */

function* watchFetchEngineResultsSuccess() {
  yield takeEvery(
    action => action.type === engineResultsModule.FETCH_ENGINE_RESULTS_SUCCESS,
    function*(action) {
      if (!action.payload.errors) {
        const engineResults = get(action.payload, 'engineResults.records');

        if (engineResults && engineResults.length) {
          const entityIds = engineResults.reduce((result, engineResult) => {
            engineResult.jsondata.series.forEach(s => {
              const entityId = get(s, 'object.entityId');

              if (entityId) {
                result[entityId] = true;
              }
            });

            return result;
          }, {});

          if (!isEmpty(entityIds)) {
            yield call(fetchEntities, Object.keys(entityIds));
          }
        }
      }
    }
  );
}

function* watchFetchLibraries() {
  yield takeEvery(
    action => action.type === faceEngineOutput.FETCH_LIBRARIES,
    fetchLibraries
  );
}

function* watchCreateEntity() {
  yield takeEvery(
    action => action.type === faceEngineOutput.CREATE_ENTITY,
    createNewEntity
  );
}

function* watchSearchEntities() {
  yield takeLatest(
    action => action.type === faceEngineOutput.SEARCH_ENTITIES,
    searchForEntities
  );
}

function* watchMediaDetailCancelEdit() {
  yield takeLatest([CANCEL_EDIT], function*({ meta: { selectedEngineId } }) {
    const pendingUserEdits = yield select(
      faceEngineOutput.pendingUserEdits,
      selectedEngineId
    );
    if (pendingUserEdits) {
      yield put(faceEngineOutput.openConfirmationDialog());
    } else {
      yield put(faceEngineOutput.toggleEditMode());
    }
  });
}

function* watchRemoveFaceDetections() {
  yield takeEvery([faceEngineOutput.REMOVE_DETECTED_FACES], function*({
    payload: { faceObjects, selectedEngineId }
  }) {
    console.log('saga', faceObjects, selectedEngineId);
    yield call(delay, 800);
    yield put(
      faceEngineOutput.processRemovedFaces(selectedEngineId, faceObjects)
    );
  });
}

export default function* root({ tdo, selectedEngineId }) {
  yield all([
    fork(watchFetchEngineResultsSuccess),
    fork(watchFetchLibraries),
    fork(watchCreateEntity),
    fork(watchSearchEntities),
    fork(watchMediaDetailCancelEdit, tdo.id),
    fork(watchRemoveFaceDetections),
    fork(onMount, tdo, selectedEngineId)
  ]);
}
