import { all, fork, takeEvery, call, select, put } from 'redux-saga/effects';
import { get } from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
import {
  FETCH_ENGINE_RUNS,
  fetchEngineRunsFailure,
  fetchEngineRunsSuccess
} from './';

const { auth: authModule, config: configModule } = modules;

function* fetchEngineRuns(tdoId) {
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  const query = `
    query temporalDataObject($tdoId: ID!) {
      temporalDataObject(id: $tdoId) {
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
    }`;

  let response;
  try {
    response = yield call(helpers.fetchGraphQLApi, {
      endpoint: graphQLUrl,
      query,
      variables: {
        tdoId
      },
      token
    });
  } catch (e) {
    yield put(fetchEngineRunsFailure(e));
  }

  const error = get(response, 'errors[0]');
  if (error) {
    yield put(fetchEngineRunsFailure(error.message));
  }

  const enginesRuns = get(
    response,
    'data.temporalDataObject.engineRuns.records'
  );

  yield put(
    fetchEngineRunsSuccess(
      enginesRuns.reduce((accumulator, engineRun) => {
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
    // TODO: Update graphql to accept and array of todIds so I don't have to do this
    yield all(tdoIds.map(id => call(fetchEngineRuns, id)));
  });
}

export default function* root() {
  yield all([fork(watchFetchEngineRuns)]);
}
