import { all, fork, takeEvery, call, select, put } from 'redux-saga/effects';
import { get, forEach } from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
import {
  FETCH_ENGINE_RUNS,
  fetchEngineRunsFailure,
  fetchEngineRunsSuccess
} from './';

const { auth: authModule, config: configModule } = modules;

function* fetchEngineRuns(tdoIds) {
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  // TODO: Update the temporalDataObjects query to accept multiple ids.
  const tdoQueries = tdoIds.reduce((accumulator, id) => {
    const subquery = `
      tdo${id}:  temporalDataObject(id: "${id}") {
        engineRuns {
          records {
            engine {
              id
              name
              signedLogoPath
              iconPath
              category {
                id
                name
                iconClass
              }
            }
          }
        }
      }
    `;
    return accumulator + subquery;
  }, '');

  const query = `
    query {
      ${tdoQueries}
    }`;

  let response;
  try {
    response = yield call(helpers.fetchGraphQLApi, {
      endpoint: graphQLUrl,
      query,
      token
    });
  } catch (e) {
    yield put(fetchEngineRunsFailure(e));
  }

  const error = get(response, 'errors[0]');
  if (error) {
    yield put(fetchEngineRunsFailure(error.message));
  }

  let engineRuns = [];
  if (response.data) {
    forEach(response.data, tdo => {
      if (get(tdo, 'engineRuns.records.length')) {
        engineRuns = engineRuns.concat(get(tdo, 'engineRuns.records'));
      }
    });
  }

  yield put(
    fetchEngineRunsSuccess(
      engineRuns.reduce((accumulator, engineRun) => {
        if (engineRun.engine) {
          return {
            ...accumulator,
            [engineRun.engine.id]: engineRun.engine
          };
        }
        return accumulator;
      }, {})
    )
  );
}

function* watchFetchEngineRuns() {
  yield takeEvery(FETCH_ENGINE_RUNS, function* onFetchEngineRuns({ tdoIds }) {
    yield call(fetchEngineRuns, tdoIds);
  });
}

export default function* root() {
  yield all([fork(watchFetchEngineRuns)]);
}
