import { all, fork, takeEvery, call, select, put } from 'redux-saga/effects';
import { get, forEach } from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
import {
  FETCH_ENGINE_RUNS,
  START_EXPORT_AND_DOWNLOAD,
  FETCH_ENGINE_RUNS_FAILURE,
  EXPORT_AND_DOWNLOAD_FAILURE,
  APPLY_SUBTITLE_CONFIGS,
  getIncludeMedia,
  fetchEngineRunsFailure,
  fetchEngineRunsSuccess,
  onExport,
  getOutputConfigurations,
  getTdoData,
  exportAndDownloadFailure,
  addSnackBar,
  storeSubtitleConfigs
} from './';
import { guid } from '../../../shared/util';

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
        id
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
                exportFormats
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
    console.error(e);
    return yield put(
      fetchEngineRunsFailure(
        'There was an error fetching engines ran for one or more of the recordings.'
      )
    );
  }

  const error = get(response, 'errors[0]');
  if (error) {
    console.error(error);
    return yield put(
      fetchEngineRunsFailure(
        'There was an error fetching engines ran for one or more of the recordings.'
      )
    );
  }

  let engineRuns = [];
  let tdoData = [];
  if (response.data) {
    forEach(response.data, tdo => {
      if (get(tdo, 'engineRuns.records.length')) {
        engineRuns = engineRuns.concat(get(tdo, 'engineRuns.records'));
        tdoData = tdoData.concat({
          tdoId: get(tdo, 'id')
        });
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
      }, {}),
      tdoData
    )
  );
}

function* exportAndDownload() {
  const onExportFunction = yield select(onExport);

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  const mutation = `
    mutation createExportRequest(
      $includeMedia: Boolean,
      $tdoData: [CreateExportRequestForTDO!]!,
      $outputConfigurations: [CreateExportRequestOutputConfig!]
    ) {
      createExportRequest(input: {
        includeMedia: $includeMedia
        tdoData: $tdoData
        outputConfigurations: $outputConfigurations
      }) {
        id
        status
        organizationId
        createdDateTime
        modifiedDateTime
        requestorId
        assetUri
      }
    }
  `;

  const includeMedia = yield select(getIncludeMedia);
  const outputConfigurations = yield select(getOutputConfigurations);
  const tdoData = yield select(getTdoData);

  const variables = {
    includeMedia,
    outputConfigurations,
    tdoData
  };

  let response;
  try {
    response = yield call(helpers.fetchGraphQLApi, {
      endpoint: graphQLUrl,
      variables,
      query: mutation,
      token
    });
  } catch (e) {
    return yield put(exportAndDownloadFailure(e));
  }

  onExportFunction(get(response, 'data.createExportRequest'));
}

function* watchFetchEngineRuns() {
  yield takeEvery(FETCH_ENGINE_RUNS, function* onFetchEngineRuns({ tdoIds }) {
    yield call(fetchEngineRuns, tdoIds);
  });
}

function* watchStartExportAndDownload() {
  yield takeEvery(
    START_EXPORT_AND_DOWNLOAD,
    function* onStartExportAndDownload() {
      yield call(exportAndDownload);
    }
  );
}

function* watchErrors() {
  yield takeEvery(
    [FETCH_ENGINE_RUNS_FAILURE, EXPORT_AND_DOWNLOAD_FAILURE],
    function* onError({ error }) {
      yield put(
        addSnackBar({
          id: guid(),
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          open: true,
          message: error,
          variant: 'error'
        })
      );
    }
  );
}

function* watchApplySubtitleConfigs() {
  yield takeEvery(APPLY_SUBTITLE_CONFIGS, function* onApplySubtitleConfigs({
    categoryId,
    values
  }) {
    yield put(storeSubtitleConfigs(categoryId, values));
  });
}

export default function* root() {
  yield all([
    fork(watchFetchEngineRuns),
    fork(watchStartExportAndDownload),
    fork(watchErrors),
    fork(watchApplySubtitleConfigs)
  ]);
}
