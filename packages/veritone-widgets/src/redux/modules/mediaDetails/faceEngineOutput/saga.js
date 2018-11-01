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
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  const entitiesQuery = `
    query entities($ids:[ID!]) {
      entities(ids: $ids) {
        records {
          id
          name
          libraryId
          library {
            id
            name
          }
          profileImageUrl
          description
          jsondata
        }
      }
    }`;

  try {
    const response = yield call(fetchGraphQLApi, {
      endpoint: graphQLUrl,
      query: entitiesQuery,
      token,
      variables: {
        ids: entityIds
      }
    });

    yield put(
      faceEngineOutput.fetchEntitiesSuccess(get(response, 'data'), {
        entityIds
      })
    );
  } catch (error) {
    yield put(faceEngineOutput.fetchEntitiesFailure(error, { entityIds }));
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
  yield takeEvery([faceEngineOutput.REMOVE_FACES], function*({
    payload: { faceObjects, selectedEngineId }
  }) {
    yield call(delay, 800);
    yield put(
      faceEngineOutput.processRemovedFaces(selectedEngineId, faceObjects)
    );
  });
}

function* watchAddFaces() {
  yield takeEvery([faceEngineOutput.ADD_DETECTED_FACE], function*({
    payload: { faceObjects, selectedEngineId, entity }
  }) {
    yield call(delay, 800);
    yield put(
      faceEngineOutput.processAddedFaces(selectedEngineId, faceObjects, entity)
    );
  });
}

export default function* root({ tdo, selectedEngineId }) {
  yield all([
    fork(watchFetchEngineResultsSuccess),
    fork(watchSearchEntities),
    fork(watchMediaDetailCancelEdit, tdo.id),
    fork(watchRemoveFaceDetections),
    fork(watchAddFaces),
    fork(onMount, tdo, selectedEngineId)
  ]);
}
