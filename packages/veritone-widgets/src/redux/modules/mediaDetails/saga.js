import {
  fork,
  all,
  call,
  put,
  takeEvery,
  select,
  take
} from 'redux-saga/effects';
import {
  get,
  uniq,
  isObject,
  isEmpty,
  isUndefined,
  isArray,
  every,
  find,
  forEach
} from 'lodash';
import { modules } from 'veritone-redux-common';
import {
  getFaceEngineAssetData,
  cancelFaceEdits,
  fetchEngineResults as fetchFaceEngineResults,
  ADD_DETECTED_FACE
} from './faceEngineOutput';
import {
  getTranscriptEditAssetData,
  reset as resetTranscript
} from './transcriptWidget';
const { auth: authModule, config: configModule } = modules;

import callGraphQLApi from '../../../shared/callGraphQLApi';
import uploadFilesChannel from '../../../shared/uploadFilesChannel';
import {
  LOAD_ENGINE_RESULTS,
  LOAD_ENGINE_RESULTS_SUCCESS,
  LOAD_TDO,
  UPDATE_TDO,
  UPDATE_TDO_FAILURE,
  LOAD_CONTENT_TEMPLATES,
  UPDATE_TDO_CONTENT_TEMPLATES,
  UPDATE_TDO_CONTENT_TEMPLATES_FAILURE,
  SET_SELECTED_ENGINE_ID,
  SELECT_ENGINE_CATEGORY,
  REQUEST_ENTITIES,
  REQUEST_ENTITIES_SUCCESS,
  REQUEST_ENTITIES_FAILURE,
  REQUEST_SCHEMAS,
  REQUEST_SCHEMAS_SUCCESS,
  REQUEST_SCHEMAS_FAILURE,
  SAVE_ASSET_DATA,
  CREATE_FILE_ASSET_SUCCESS,
  TOGGLE_EDIT_MODE,
  loadEngineCategoriesSuccess,
  loadEngineCategoriesFailure,
  loadEngineResultsRequest,
  loadEngineResultsSuccess,
  loadEngineResultsFailure,
  loadTdoSuccess,
  loadTdoFailure,
  updateTdoSuccess,
  updateTdoFailure,
  loadContentTemplatesSuccess,
  loadContentTemplatesFailure,
  loadTdoContentTemplatesSuccess,
  loadTdoContentTemplatesFailure,
  selectEngineCategory,
  setEngineId,
  getTdoMetadata,
  getTdo,
  getEngineResultRequestsByEngineId,
  toggleSaveMode,
  saveAssetDataFailure,
  createFileAssetSuccess,
  createFileAssetFailure,
  createBulkEditTranscriptAssetSuccess,
  createBulkEditTranscriptAssetFailure,
  isEditModeEnabled,
  isUserGeneratedTranscriptEngineId,
  isUserGeneratedFaceEngineId,
  toggleEditMode,
  getSelectedEngineCategory,
  getSelectedEngineId,
  refreshEngineRunsSuccess,
  clearEngineResultsByEngineId,
  getEngineCategories
} from '.';

import { UPDATE_EDIT_STATUS } from './transcriptWidget';

const tdoInfoQueryClause = `id
    details
    startDateTime
    stopDateTime
    applicationId
    security {
      global
    }
    thumbnailUrl
    sourceImageUrl
    primaryAsset(assetType: "media") {
      id
      signedUri
    }
    streams {
      protocol
      uri
    }`;

const engineRunsQueryClause = `engineRuns {
      records {
        engine {
          id
          name
          mode
          category {
            id
            name
            categoryType
            iconClass
            editable
          }
        }
        status
      }
    }
  `;

function* finishLoadEngineCategories(widgetId, result, { error }) {
  if (error) {
    return yield put(loadEngineCategoriesFailure(widgetId, { error }));
  }
  return yield put(loadEngineCategoriesSuccess(widgetId, result));
}

function processEngineRuns(engineRuns) {
  const orderedSupportedCategoryTypes = [
    'transcript',
    'face',
    'object',
    'logo',
    'ocr',
    'fingerprint',
    'translate',
    'sentiment',
    'geolocation',
    'correlation'
  ];
  const engineCategories = [];
  console.log(engineRuns);

  engineRuns
    .map(engineRun => {
      const engineId = get(engineRun, 'engine.id');
      if (isUserGeneratedTranscriptEngineId(engineId)) {
        engineRun.engine.category = {
          id: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
          name: 'Transcription',
          iconClass: 'icon-transcription',
          categoryType: 'transcript',
          editable: true
        };
      } else if (isUserGeneratedFaceEngineId(engineId)) {
        engineRun.engine.category = {
          id: '6faad6b7-0837-45f9-b161-2f6bf31b7a07',
          name: 'Facial Detection',
          categoryType: 'face',
          iconClass: 'icon-face',
          editable: true
        };
      }
      return engineRun;
    })
    // filter those that have category, category icon, and are supported categories
    .filter(
      engineRun =>
        get(engineRun, 'engine.category.iconClass.length') &&
        orderedSupportedCategoryTypes.includes(
          get(engineRun, 'engine.category.categoryType')
        )
    )
    .forEach(engineRun => {
      let engineCategory = engineCategories.find(
        category => category.id === engineRun.engine.category.id
      );
      if (!engineCategory) {
        engineCategory = Object.assign({}, engineRun.engine.category);
        engineCategory.iconClass = engineCategory.iconClass.replace(
          '-engine',
          ''
        );
        if (engineCategory.categoryType === 'correlation') {
          engineCategory.iconClass = 'icon-third-party-data';
        }
        engineCategory.engines = [];
        engineCategories.push(engineCategory);
      }
      engineRun.engine.status = engineRun.status;
      engineCategory.engines.push(engineRun.engine);
      console.log('engineRun', engineRun);
      console.log('engineCategory', engineCategory);
    });

  // order categories: first the most frequently used as defined by product, then the rest - alphabetically
  engineCategories.sort((category1, category2) => {
    // sort all alphabetically
    if (category1.categoryType < category2.categoryType) {
      return -1;
    }
    if (category1.categoryType > category2.categoryType) {
      return 1;
    }
    return 0;
  });
  orderedSupportedCategoryTypes.reverse().forEach(orderedCategoryType => {
    // reverse ordered and add to the result at the front
    const index = engineCategories.findIndex(
      category => category.categoryType === orderedCategoryType
    );
    if (index >= 0) {
      const category = engineCategories[index];
      engineCategories.splice(index, 1);
      engineCategories.unshift(category);
    }
  });

  return engineCategories;
}

function* loadTdoSaga(widgetId, tdoId) {
  const getTdoQuery = `query temporalDataObject($tdoId: ID!){
      temporalDataObject(id: $tdoId) {
        ${tdoInfoQueryClause}
        # Run engines and categories query clauses
        ${engineRunsQueryClause}
      }
    }
  `;

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const sessionToken = yield select(authModule.selectSessionToken);
  const oauthToken = yield select(authModule.selectOAuthToken);
  const token = sessionToken || oauthToken;

  let response;
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: getTdoQuery,
      variables: { tdoId },
      token
    });
  } catch (error) {
    return yield put(loadTdoFailure(widgetId, error));
  }

  if (!get(response, 'data.temporalDataObject.id')) {
    return yield put(loadTdoFailure(widgetId, 'Media not found'));
  }

  const tdo = response.data.temporalDataObject;
  let engineCategories = [];

  // Extract EngineCategories data from EngineRuns
  if (get(tdo, 'engineRuns.records', false)) {
    engineCategories = processEngineRuns(tdo.engineRuns.records);
  }

  delete tdo.jobs;
  delete tdo.assets;

  yield put(loadTdoSuccess(widgetId, tdo));

  yield* finishLoadEngineCategories(widgetId, engineCategories, {
    error: false
  });
  if (engineCategories.length) {
    yield put(selectEngineCategory(widgetId, engineCategories[0]));
  }
  // initiate loading content templates for this tdo
  yield call(loadTdoContentTemplatesSaga, widgetId);
}

function* refreshEngineRuns(widgetId, tdoId) {
  const refreshEngineRunsQuery = `query temporalDataObject($tdoId: ID!){
    temporalDataObject(id: $tdoId) {
      # Run engines and categories query clauses
      ${engineRunsQueryClause}
    }
  }`;

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const sessionToken = yield select(authModule.selectSessionToken);
  const oauthToken = yield select(authModule.selectOAuthToken);
  const token = sessionToken || oauthToken;

  let response;
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: refreshEngineRunsQuery,
      variables: { tdoId },
      token
    });
  } catch (error) {
    throw new Error(
      'refreshEnginesRun failed with the following error: ',
      error
    );
  }

  const engineRuns = get(
    response,
    'data.temporalDataObject.engineRuns.records'
  );
  let engineCategories = [];
  if (engineRuns) {
    engineCategories = processEngineRuns(engineRuns);
  } else {
    throw new Error('Could not refresh engineRuns');
  }
  yield put(refreshEngineRunsSuccess(engineRuns, widgetId));
  yield* finishLoadEngineCategories(widgetId, engineCategories, {
    error: false
  });
}

function* updateTdoSaga(widgetId, tdoId, tdoDataToUpdate) {
  const updateTdoQuery = `mutation updateTDO($tdoId: ID!, $details: JSONData){
      updateTDO( input: {
        id: $tdoId
        details: $details
      })
      {
        ${tdoInfoQueryClause}
      }
    }`;

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  let response;
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: updateTdoQuery,
      variables: {
        tdoId,
        details: !isEmpty(tdoDataToUpdate) ? tdoDataToUpdate : null
      },
      token
    });
  } catch (error) {
    return yield put(updateTdoFailure(widgetId, { error }));
  }

  if (!isEmpty(response.errors)) {
    return yield put(
      updateTdoFailure(widgetId, {
        error: 'Error updating media.'
      })
    );
  }

  if (!get(response, 'data.updateTDO')) {
    return yield put(
      updateTdoFailure(widgetId, {
        error: 'TemporalDataObject not found after update'
      })
    );
  }

  yield put(updateTdoSuccess(widgetId, response.data.updateTDO));
}

function* loadEngineResultsSaga(
  widgetId,
  engineId,
  startOffsetMs,
  stopOffsetMs
) {
  const getEngineResultsQuery = `query engineResults($tdoId: ID!, $engineIds: [ID!]!, $startOffsetMs: Int, $stopOffsetMs: Int) {
      engineResults(tdoId: $tdoId, engineIds: $engineIds, startOffsetMs: $startOffsetMs, stopOffsetMs: $stopOffsetMs) {
        records {
          tdoId
          engineId
          startOffsetMs
          stopOffsetMs
          jsondata
        }
      }
    }`;

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);
  const requestTdo = yield select(getTdo, widgetId);
  const variables = { tdoId: requestTdo.id, engineIds: [engineId] };
  if (startOffsetMs) {
    variables.startOffsetMs = startOffsetMs;
  }
  if (stopOffsetMs) {
    variables.stopOffsetMs = stopOffsetMs;
  }
  let response;
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: getEngineResultsQuery,
      variables: variables,
      token
    });
  } catch (error) {
    return yield put(
      loadEngineResultsFailure({
        error,
        startOffsetMs,
        stopOffsetMs,
        engineId,
        widgetId
      })
    );
  }

  yield put(
    loadEngineResultsSuccess(response.data.engineResults.records, {
      startOffsetMs,
      stopOffsetMs,
      engineId,
      widgetId
    })
  );
}

function* loadContentTemplates(widgetId) {
  let loadTemplatesQuery = `query {
    dataRegistries {
      records {
        id
        name
        description
        organizationId
        schemas {
          records {
            id
            status
            definition
            majorVersion
            minorVersion
            validActions
          }
        }
      }
    }
  }`;

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  let response;
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: loadTemplatesQuery,
      token
    });
  } catch (error) {
    return yield put(loadContentTemplatesFailure(widgetId, { error }));
  }

  if (!isEmpty(response.errors)) {
    return yield put(
      loadContentTemplatesFailure(widgetId, {
        error: 'Error loading content templates.'
      })
    );
  }

  const result = get(response.data, 'dataRegistries.records', []);

  yield put(loadContentTemplatesSuccess(widgetId, result));
}

function* loadTdoContentTemplatesSaga(widgetId) {
  const getTdoContentTemplates = `query temporalDataObject($tdoId: ID!){
      temporalDataObject(id: $tdoId) {
        assets(type: "content-template") {
          records {
            id
            transform(transformFunction: JSON)
            sourceData {
              schema {
                id
                status
                definition
                majorVersion
                minorVersion
                validActions
                dataRegistry {
                  name
                }
              }
            }
          }
        }
      }
    }`;

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);
  const requestTdo = yield select(getTdo, widgetId);
  const variables = { tdoId: requestTdo.id };

  let response;
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: getTdoContentTemplates,
      token,
      variables
    });
  } catch (error) {
    return yield put(loadTdoContentTemplatesFailure(widgetId, { error }));
  }

  if (!isEmpty(response.errors)) {
    return yield put(
      loadTdoContentTemplatesFailure(widgetId, {
        error: 'Error loading content templates for media.'
      })
    );
  }

  const result = get(response.data, 'temporalDataObject.assets', {});

  yield put(loadTdoContentTemplatesSuccess(widgetId, result));
}

function* updateTdoContentTemplatesSaga(
  widgetId,
  contentTemplatesToDelete,
  contentTemplatesToCreate
) {
  const assetIdsToDelete = contentTemplatesToDelete
    .filter(contentTemplate => !!contentTemplate.assetId)
    .map(contentTemplate => contentTemplate.assetId);

  let response;
  try {
    response = yield all([
      call(deleteAssetsSaga, uniq(assetIdsToDelete)),
      call(createTdoContentTemplatesSaga, widgetId, contentTemplatesToCreate)
    ]);
  } catch (error) {
    response = { errors: [error] };
  }

  if (!isEmpty(response.errors)) {
    yield put({
      type: UPDATE_TDO_CONTENT_TEMPLATES_FAILURE,
      error: 'Error updating content templates.'
    });
  }

  yield call(loadTdoContentTemplatesSaga, widgetId);
}

function* createTdoContentTemplatesSaga(widgetId, contentTemplates) {
  if (!contentTemplates || !contentTemplates.length) {
    return {};
  }

  const requestTdo = yield select(getTdo, widgetId);

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  const errors = [];
  const applyContentTemplatesQuery = `mutation updateTDO($tdoId: ID!, $schemaId: ID!, $data: JSONData){
      updateTDO( input: {
        id: $tdoId
        contentTemplates: [{schemaId: $schemaId, data: $data}]
      })
      { id }
    }`;
  for (let i = 0; i < contentTemplates.length; i++) {
    const variables = {
      tdoId: requestTdo.id,
      schemaId: contentTemplates[i].id,
      data: contentTemplates[i].data
    };
    let response;
    try {
      response = yield call(callGraphQLApi, {
        endpoint: graphQLUrl,
        query: applyContentTemplatesQuery,
        token,
        variables
      });
    } catch (error) {
      errors.push(error);
    }
    if (!isEmpty(response.errors)) {
      response.errors.forEach(error => errors.push(error));
    }
  }

  if (errors.length) {
    return { errors };
  }

  return {};
}

function* deleteAssetsSaga(assetIds) {
  if (!assetIds || !assetIds.length) {
    return {};
  }

  const headerParams = [];
  const deleteAssetClauses = [];
  const variables = {};

  assetIds.forEach((assetId, i) => {
    headerParams.push(`$assetId${i}: ID!`);
    deleteAssetClauses.push(
      `da${i}: deleteAsset (id: $assetId${i}) { id message }`
    );
    variables[`assetId${i}`] = assetId;
  });

  const deleteAssetsQuery = `mutation deleteAsset(${headerParams.join(
    ', '
  )}){ ${deleteAssetClauses.join(' ')} }`;

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  let response;
  const errors = [];
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: deleteAssetsQuery,
      token,
      variables
    });
  } catch (error) {
    errors.push(error);
  }
  if (!isEmpty(response.errors)) {
    response.errors.forEach(error => errors.push(error));
  }

  if (errors.length) {
    return { errors };
  }

  return {};
}

function* createFileAssetSaga(
  widgetId,
  type,
  contentType,
  sourceData,
  fileData
) {
  if (sourceData.sourceEngineId) {
    return yield put(
      saveAssetDataFailure(widgetId, {
        error: 'Source engine id must be set on the engine result'
      })
    );
  }
  const requestTdo = yield select(getTdo, widgetId);
  const createAssetQuery = `mutation createAsset(
    $tdoId: ID!,
    $type: String,
    $contentType: String,
    $file: UploadedFile,
    $sourceData: SetAssetSourceData
  ){
    createAsset( input: {
      containerId: $tdoId,
      type: $type,
      contentType: $contentType,
      sourceData: $sourceData,
      file: $file,
      isUserEdited: true
    })
    { id }
  }`;

  const variables = {
    tdoId: requestTdo.id,
    type,
    contentType,
    file: fileData,
    sourceData
  };

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  const formData = new FormData();
  formData.append('query', createAssetQuery);
  formData.append('variables', JSON.stringify(variables));
  if (contentType === 'application/json') {
    formData.append(
      'file',
      new Blob([JSON.stringify(fileData)], { type: contentType })
    );
  } else {
    formData.append('file', new Blob([fileData], { type: contentType }));
  }

  const saveFile = function({ endpoint, data, authToken }) {
    return fetch(endpoint, {
      method: 'post',
      body: data,
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).then(r => {
      return r.json();
    });
  };

  let response;
  try {
    response = yield call(saveFile, {
      endpoint: graphQLUrl,
      data: formData,
      authToken: token
    });
  } catch (error) {
    return yield put(createFileAssetFailure(widgetId, { error }));
  }
  if (!isEmpty(response.errors)) {
    return yield put(
      createFileAssetFailure(widgetId, { error: response.errors.join(', \n') })
    );
  }
  if (!get(response, 'data.createAsset.id')) {
    return yield put(
      createFileAssetFailure(widgetId, {
        error: 'Failed to create file asset.'
      })
    );
  }

  const assetId = get(response, 'data.createAsset.id');
  if (assetId) {
    const selectedEngineCategory = yield select(
      getSelectedEngineCategory,
      widgetId
    );
    yield call(refreshEngineRuns, widgetId, requestTdo.id);
    const engineCategories = yield select(getEngineCategories, widgetId);
    const updatedCategory = find(engineCategories, {
      categoryType: selectedEngineCategory.categoryType
    });
    const userGeneratedEngine = find(updatedCategory.engines, engine => {
      return (
        engine.id === 'user-edited-face-engine-results' ||
        engine.id === '7a3d86bf-331d-47e7-b55c-0434ec6fe5fd' ||
        engine.id === 'bulk-edit-transcript' ||
        engine.id === 'bde0b023-333d-acb0-e01a-f95c74214607'
      );
    });
    let userGeneratedEngineId;
    if (userGeneratedEngine) {
      userGeneratedEngineId = userGeneratedEngine.id;
    }
    // Reset the the transcipt engine results.
    if (selectedEngineCategory.categoryType === 'transcript') {
      yield put(clearEngineResultsByEngineId(userGeneratedEngineId, widgetId));
    } else if (selectedEngineCategory.categoryType === 'face') {
      const selectedEngineId = yield select(getSelectedEngineId, widgetId);
      yield put(
        fetchFaceEngineResults({
          selectedEngineId,
          tdo: requestTdo
        })
      );
    }
    yield put(toggleEditMode(widgetId, selectedEngineCategory));
    yield put(selectEngineCategory(widgetId, updatedCategory));
    yield put(createFileAssetSuccess(widgetId, assetId));
  }

  return response;
}

function* createTranscriptBulkEditAssetSaga(
  widgetId,
  type,
  contentType,
  sourceData,
  text,
  selectedEngineId
) {
  let createFileAssetResponse;
  try {
    createFileAssetResponse = yield call(
      createFileAssetSaga,
      widgetId,
      type,
      contentType,
      sourceData,
      text
    );
  } catch (error) {
    return yield put(createBulkEditTranscriptAssetFailure(widgetId, { error }));
  }
  if (!createFileAssetResponse) {
    return yield put(
      createBulkEditTranscriptAssetFailure(widgetId, {
        error: 'Failed to create bulk edit text asset.'
      })
    );
  }

  const requestTdo = yield select(getTdo, widgetId);
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const sessionToken = yield select(authModule.selectSessionToken);
  const oauthToken = yield select(authModule.selectOAuthToken);
  const token = sessionToken || oauthToken;

  const bulkTextAssetId = get(createFileAssetResponse, 'data.createAsset.id');
  let originalTranscriptAssetId;

  // to run bulk-edit-transcript task first try to find original 'transcript' ttml asset
  const getPrimaryTranscriptAssetQuery = `query temporalDataObject($tdoId: ID!){
      temporalDataObject(id: $tdoId) {
        primaryAsset(assetType: "transcript") {
          id
        }
      }
    }`;
  let getPrimaryTranscriptAssetResponse;
  try {
    getPrimaryTranscriptAssetResponse = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: getPrimaryTranscriptAssetQuery,
      variables: { tdoId: requestTdo.id },
      token
    });
  } catch (error) {
    return yield put(createBulkEditTranscriptAssetFailure(widgetId, { error }));
  }
  // if not found 'transcript' ttml asset - try to find original 'vtn-standard' asset for selected transcript engine
  if (
    get(
      getPrimaryTranscriptAssetResponse,
      'data.temporalDataObject.primaryAsset.id'
    )
  ) {
    originalTranscriptAssetId = get(
      getPrimaryTranscriptAssetResponse,
      'data.temporalDataObject.primaryAsset.id'
    );
  } else {
    const getVtnStandardAssetsQuery = `query temporalDataObject($tdoId: ID!){
      temporalDataObject(id: $tdoId) {
        assets (limit: 1000, type: "vtn-standard", orderBy: createdDateTime) {
          records {
            id
            sourceData {
              engineId
            }
          }
        }
      }
    }`;
    let getVtnStandardAssetsResponse;
    try {
      getVtnStandardAssetsResponse = yield call(callGraphQLApi, {
        endpoint: graphQLUrl,
        query: getVtnStandardAssetsQuery,
        variables: { tdoId: requestTdo.id },
        token
      });
    } catch (error) {
      return yield put(
        createBulkEditTranscriptAssetFailure(widgetId, { error })
      );
    }
    const transcriptVtnAsset = get(
      getVtnStandardAssetsResponse,
      'data.temporalDataObject.assets.records',
      []
    ).find(asset => get(asset, 'sourceData.engineId') === selectedEngineId);
    originalTranscriptAssetId = get(transcriptVtnAsset, 'id');
  }

  if (!originalTranscriptAssetId) {
    return yield put(
      createBulkEditTranscriptAssetFailure(widgetId, {
        error:
          'Original transcript asset not found. Failed to save bulk transcript edit.'
      })
    );
  }

  // run levenstein engine
  const runBulkEditJobQuery = `mutation createJob($tdoId: ID!){
    createJob(input: {
      targetId: $tdoId,
      tasks: [{
        engineId: "bulk-edit-transcript",
        payload: {
          originalTranscriptAssetId: "${originalTranscriptAssetId}",
          temporaryBulkEditAssetId: "${bulkTextAssetId}",
          saveTtmlToVtnStandard: true
        }
      },
      {
        engineId: "insert-into-index"
      },
      {
        engineId: "mention-generate"
      }]
    }) {
      id
      tasks {
        records {
          id
        }
      }
    }
  }`;

  let runBulkEditJobResponse;
  try {
    runBulkEditJobResponse = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: runBulkEditJobQuery,
      variables: { tdoId: requestTdo.id },
      token
    });
  } catch (error) {
    return yield put(createBulkEditTranscriptAssetFailure(widgetId, { error }));
  }
  if (!get(runBulkEditJobResponse, 'data.createJob.id')) {
    return yield put(
      createBulkEditTranscriptAssetFailure(widgetId, {
        error:
          'Failed to start bulk-edit-transcript job. Failed to save bulk transcript edit.'
      })
    );
  }
  if (
    isEmpty(get(runBulkEditJobResponse, 'data.createJob.tasks.records')) ||
    !get(get(runBulkEditJobResponse, 'data.createJob.tasks.records')[0], 'id')
  ) {
    return yield put(
      createBulkEditTranscriptAssetFailure(widgetId, {
        error:
          'Failed to create task for bulk-edit-transcript job. Failed to save bulk transcript edit.'
      })
    );
  }

  return yield put(createBulkEditTranscriptAssetSuccess(widgetId));
}

function* watchUpdateTdoContentTemplates() {
  yield takeEvery(UPDATE_TDO_CONTENT_TEMPLATES, function*(action) {
    const {
      contentTemplatesToDelete,
      contentTemplatesToCreate
    } = action.payload;
    const { widgetId } = action.meta;
    yield call(
      updateTdoContentTemplatesSaga,
      widgetId,
      contentTemplatesToDelete,
      contentTemplatesToCreate
    );
  });
}

function* watchLoadEngineResultsRequest() {
  yield takeEvery(LOAD_ENGINE_RESULTS, function*(action) {
    const { engineId } = action.payload;
    let { startOffsetMs, stopOffsetMs } = action.payload;
    const { widgetId } = action.meta;

    yield call(
      loadEngineResultsSaga,
      widgetId,
      engineId,
      startOffsetMs,
      stopOffsetMs
    );
  });
}

function* fetchEntities(widgetId, entityIds) {
  yield put({ type: REQUEST_ENTITIES, meta: { widgetId } });
  let entityQueries = entityIds.map((id, index) => {
    return `
      entity${index}: entity(id:"${id}") {
        id
        name
        description
        profileImageUrl
        jsondata
        libraryId
        library {
          id
          name
          description
          coverImageUrl
        }
      }
    `;
  });

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  let response;
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: `query{${entityQueries.join(' ')}}`,
      token
    });
  } catch (error) {
    return yield put({
      type: REQUEST_ENTITIES_FAILURE,
      error: 'Error fetching entities from server.',
      meta: { widgetId }
    });
  }

  if (response.errors) {
    return yield put({
      type: REQUEST_ENTITIES_FAILURE,
      error: 'Error thrown while fetching entities',
      meta: { widgetId }
    });
  }
  yield put({
    type: REQUEST_ENTITIES_SUCCESS,
    payload: response.data,
    meta: { widgetId }
  });
}

function* fetchSchemas(widgetId, schemaIds) {
  yield put({ type: REQUEST_SCHEMAS, meta: { widgetId } });
  let schemaQueries = schemaIds.map((id, index) => {
    return `
      schema${index}: schema(id:"${id}") {
        id
        status
        definition
        majorVersion
        minorVersion
        validActions
        dataRegistry {
          name
        }
      }
    `;
  });

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  let response;
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: `query{${schemaQueries.join(' ')}}`,
      token
    });
  } catch (error) {
    return yield put({
      type: REQUEST_SCHEMAS_FAILURE,
      error: 'Error fetching schemas from server.'
    });
  }

  if (response.errors) {
    return yield put({
      type: REQUEST_SCHEMAS_FAILURE,
      error: 'Error thrown while fetching schemas',
      meta: { widgetId }
    });
  }
  return yield put({
    type: REQUEST_SCHEMAS_SUCCESS,
    payload: response.data,
    meta: { widgetId }
  });
}

function* watchLoadEngineResultsComplete() {
  yield takeEvery(LOAD_ENGINE_RESULTS_SUCCESS, function*(action) {
    let entityIds = [],
      schemaIds = [];
    action.payload.forEach(jsonData => {
      jsonData.jsondata.series.forEach(s => {
        let entityId = get(s, 'object.entityId');
        if (entityId) {
          entityIds.push(entityId);
        }
        let structuredData = get(s, 'structuredData');
        if (structuredData) {
          Object.keys(structuredData).forEach(schemaId =>
            schemaIds.push(schemaId)
          );
        }
      });
    });

    if (entityIds.length) {
      yield call(fetchEntities, action.meta.widgetId, uniq(entityIds));
    }
    if (schemaIds.length) {
      yield call(fetchSchemas, action.meta.widgetId, uniq(schemaIds));
    }
  });
}

function* watchLoadTdoRequest() {
  yield takeEvery(LOAD_TDO, function*(action) {
    const { tdoId } = action.payload;
    const { widgetId } = action.meta;
    yield call(loadTdoSaga, widgetId, tdoId);
  });
}

function* uploadImage(fileToUpload, widgetId) {
  const getUrlQuery = `query urls($name: String!){
    getSignedWritableUrl(key: $name) {
      url
      key
      bucket
      expiresInSeconds
      getUrl
      unsignedUrl
    }
  }`;

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  let signedWritableUrlResponse;
  try {
    signedWritableUrlResponse = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: getUrlQuery,
      variables: { name },
      token
    });
  } catch (error) {
    return yield* put({
      type: UPDATE_TDO_FAILURE,
      payload: error,
      meta: { widgetId }
    });
  }

  if (
    signedWritableUrlResponse.errors &&
    signedWritableUrlResponse.errors.length
  ) {
    throw new Error(
      `Call to getSignedWritableUrl returned error: ${
        signedWritableUrlResponse.errors[0].message
      }`
    );
  }

  let resultChan;
  try {
    resultChan = yield call(
      uploadFilesChannel,
      [signedWritableUrlResponse.data.getSignedWritableUrl],
      [fileToUpload]
    );
  } catch (error) {
    return yield* put({
      type: UPDATE_TDO_FAILURE,
      payload: error,
      meta: { widgetId }
    });
  }

  let uploadingImageToS3 = true;
  while (uploadingImageToS3) {
    const {
      error,
      success,
      file,
      descriptor: { unsignedUrl }
    } = yield take(resultChan);

    if (success || error) {
      uploadingImageToS3 = false;

      if (error) {
        throw new Error(`Error while uploading ${file.filename}`);
      }
      return yield unsignedUrl;
    }
    continue;
  }
}

function* watchUpdateTdoRequest() {
  yield takeEvery(UPDATE_TDO, function*(action) {
    const { tdoId, tdoDataToUpdate } = action.payload;
    const { widgetId } = action.meta;

    // Check to see if programImage and programLiveImages are file objects and if so upload.
    try {
      const programLiveImage = get(
        tdoDataToUpdate,
        'veritoneProgram.programLiveImage'
      );
      if (isObject(programLiveImage)) {
        tdoDataToUpdate.veritoneProgram.programLiveImage = yield call(
          uploadImage,
          tdoDataToUpdate.veritoneProgram.programLiveImage
        );
      }
      const programImage = get(tdoDataToUpdate, 'veritoneProgram.programImage');
      if (isObject(programImage)) {
        tdoDataToUpdate.veritoneProgram.programImage = yield call(
          uploadImage,
          tdoDataToUpdate.veritoneProgram.programImage
        );
      }
    } catch (error) {
      return yield put({
        type: UPDATE_TDO_FAILURE,
        payload: error,
        meta: { widgetId }
      });
    }

    const metaData = yield select(getTdoMetadata, widgetId);
    // Take the new updated metadata and construct the query for graphql
    const detailsToSave = {};
    if (!isEmpty(get(tdoDataToUpdate, 'veritoneFile'))) {
      detailsToSave.veritoneFile = {
        ...get(metaData, 'veritoneFile'),
        ...get(tdoDataToUpdate, 'veritoneFile')
      };
    }
    if (!isEmpty(get(tdoDataToUpdate, 'veritoneCustom'))) {
      detailsToSave.veritoneCustom = {
        ...get(metaData, 'veritoneCustom'),
        ...get(tdoDataToUpdate, 'veritoneCustom')
      };
    }
    if (!every(get(tdoDataToUpdate, 'veritoneProgram'), isUndefined)) {
      detailsToSave.veritoneProgram = {
        ...get(metaData, 'veritoneProgram')
      };
      if (!isUndefined(get(tdoDataToUpdate, 'veritoneProgram.programImage'))) {
        detailsToSave.veritoneProgram.programImage = get(
          tdoDataToUpdate,
          'veritoneProgram.programImage'
        );
      }
      if (
        !isUndefined(get(tdoDataToUpdate, 'veritoneProgram.programLiveImage'))
      ) {
        detailsToSave.veritoneProgram.programLiveImage = get(
          tdoDataToUpdate,
          'veritoneProgram.programLiveImage'
        );
      }
    }
    if (get(tdoDataToUpdate, 'tags') && isArray(get(tdoDataToUpdate, 'tags'))) {
      detailsToSave.tags = get(tdoDataToUpdate, 'tags');
    }
    yield call(updateTdoSaga, widgetId, tdoId, detailsToSave);
  });
}

function* watchLoadContentTemplates() {
  yield takeEvery(LOAD_CONTENT_TEMPLATES, function*(action) {
    const { widgetId } = action.meta;
    yield call(loadContentTemplates, widgetId);
  });
}

function* watchSetEngineId() {
  yield takeEvery(SET_SELECTED_ENGINE_ID, function*(action) {
    const selectedEngineId = action.payload;
    const { widgetId } = action.meta;

    if (!selectedEngineId) {
      return;
    }

    // TODO: Currently fetching the entire tdo assets. Will eventually use mediaplayer time etc to fetch the required data
    const currentTdo = yield select(getTdo, widgetId);
    const startOfTdo = new Date(currentTdo.startDateTime).getTime();
    const endOfTdo = new Date(currentTdo.stopDateTime).getTime();
    let startOffsetMs, stopOffsetMs;
    if (!startOffsetMs) {
      startOffsetMs = 0;
    }
    if (!stopOffsetMs) {
      stopOffsetMs = endOfTdo - startOfTdo;
    }

    let engineResultRequests = yield select(
      getEngineResultRequestsByEngineId,
      widgetId,
      selectedEngineId
    );
    let resultsInTimeBounds = engineResultRequests.filter(result => {
      return (
        (result.startOffsetMs >= startOffsetMs &&
          result.startOffsetMs <= stopOffsetMs) ||
        (result.startOffsetMs >= startOffsetMs &&
          result.startOffsetMs <= stopOffsetMs)
      );
    });

    // TODO: Optimize this to get all gaps not just the first
    if (resultsInTimeBounds.length === 1) {
      if (resultsInTimeBounds[0].startOffsetMs > startOffsetMs) {
        stopOffsetMs = resultsInTimeBounds[0].startOffsetMs - 1;
      } else {
        startOffsetMs = resultsInTimeBounds[0].stopOffsetMs + 1;
      }
    } else if (resultsInTimeBounds.length > 1) {
      startOffsetMs = resultsInTimeBounds[0].stopOffsetMs + 1;
      stopOffsetMs = resultsInTimeBounds[1].startOffsetMs - 1;
    }

    if (startOffsetMs > stopOffsetMs) {
      return;
    }

    yield put(
      loadEngineResultsRequest(
        widgetId,
        selectedEngineId,
        startOffsetMs,
        stopOffsetMs
      )
    );
  });
}

function* watchSelectEngineCategory() {
  yield takeEvery(SELECT_ENGINE_CATEGORY, function*(action) {
    const { engines } = action.payload;
    const { widgetId } = action.meta;
    const engineId = engines.length ? engines[0].id : undefined;

    yield put(setEngineId(widgetId, engineId));
  });
}

function* watchTranscriptStatus() {
  yield takeEvery(UPDATE_EDIT_STATUS, function*(action) {
    yield put(toggleSaveMode(action.hasUserEdits));
  });
}

function* watchFaceEngineEntityUpdate() {
  yield takeEvery(action => action.type === ADD_DETECTED_FACE, function*(
    action
  ) {
    yield put(toggleSaveMode(true));
  });
}

// Remove AWS prefixed params, keep the rest.
function removeAwsSignatureParams(uri) {
  const amzParamKeyRegex = /[x..X]-[a..A][m..M][z..Z]/;
  if (!uri || !uri.includes('?') || !amzParamKeyRegex.test(uri)) {
    return uri;
  }
  const nakedUri = uri.split('?')[0];
  const uriParamsStr = uri.split('?')[1];
  const nonAwsSignatureParams = uriParamsStr
    .split('&')
    .filter(
      uriParam =>
        uriParam && uriParam.length && !amzParamKeyRegex.test(uriParam)
    );
  if (nonAwsSignatureParams.length) {
    return `${nakedUri}?${nonAwsSignatureParams.join('&')}`;
  }
  return nakedUri;
}

function* watchSaveAssetData() {
  yield takeEvery(SAVE_ASSET_DATA, function*(action) {
    let assetData;
    if (action.payload.selectedEngineCategory.categoryType === 'transcript') {
      assetData = yield select(
        getTranscriptEditAssetData,
        action.payload.selectedEngineId
      );
      if (assetData.isBulkEdit) {
        const contentType = 'text/plain';
        const type = 'v-bulk-edit-transcript';
        const sourceData = '{}';
        const { widgetId } = action.meta;
        // do save bulk transcript asset and return
        return yield call(
          createTranscriptBulkEditAssetSaga,
          widgetId,
          type,
          contentType,
          sourceData,
          assetData.text,
          action.payload.selectedEngineId
        );
      }
      delete assetData.isBulkEdit;
      assetData = [assetData];
    } else if (action.payload.selectedEngineCategory.categoryType === 'face') {
      assetData = yield select(
        getFaceEngineAssetData,
        action.payload.selectedEngineId
      );
    }
    if (!assetData) {
      return yield put(
        saveAssetDataFailure(action.meta.widgetId, {
          error: 'Asset data to store must be provided'
        })
      );
    }
    const createAssetCalls = [];
    forEach(assetData, jsonData => {
      if (get(jsonData, 'series.length')) {
        forEach(jsonData.series, asset => {
          if (get(asset, 'object.uri')) {
            asset.object.uri = removeAwsSignatureParams(
              get(asset, 'object.uri')
            );
          }
        });
      }
      // process vtn-standard asset
      const contentType = 'application/json';
      const type = 'vtn-standard';
      const sourceData = {
        name: jsonData.sourceEngineName,
        engineId: jsonData.sourceEngineId,
        assetId: jsonData.assetId,
        taskId: jsonData.taskId
      };
      const { widgetId } = action.meta;
      createAssetCalls.push(
        call(
          createFileAssetSaga,
          widgetId,
          type,
          contentType,
          sourceData,
          jsonData
        )
      );
    });
    return yield all(createAssetCalls);
  });
}

function* watchCreateFileAssetSuccess() {
  const createJobQuery = `mutation createJob($tdoId: ID!) {
    createJob(input: {
      targetId: $tdoId,
      tasks: [{
        engineId: "insert-into-index"
      }]
    }) {
      id
      tasks {
        records {
          id
          jobId
        }
      }
    }
  }`;

  yield takeEvery(
    action => action.type === CREATE_FILE_ASSET_SUCCESS,
    function* insertIntoIndex(action) {
      const { widgetId } = action.meta;
      const config = yield select(configModule.getConfig);
      const { apiRoot, graphQLEndpoint } = config;
      const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
      const sessionToken = yield select(authModule.selectSessionToken);
      const oauthToken = yield select(authModule.selectOAuthToken);
      const token = sessionToken || oauthToken;

      try {
        const tdo = yield select(getTdo, widgetId);
        const response = yield call(callGraphQLApi, {
          endpoint: graphQLUrl,
          query: createJobQuery,
          variables: { tdoId: tdo.id },
          token
        });

        if (!get(response, 'data.createJob.id')) {
          throw new Error('Failed to create insert-into-index task.');
        }
        if (
          isEmpty(get(response, 'data.createJob.tasks.records')) ||
          !get(response, 'data.createJob.tasks.records[0].id')
        ) {
          throw new Error('Failed to create insert-into-index task.');
        }
      } catch (error) {
        // return yield put(insertIntoIndexFailure(widgetId, { error }));
      }
    }
  );
}

function* watchCancelEdit() {
  yield takeEvery(action => action.type === TOGGLE_EDIT_MODE, function*(
    action
  ) {
    const editModeIsEnabled = yield select(
      isEditModeEnabled,
      action.meta.widgetId
    );

    if (!editModeIsEnabled) {
      const selectedEngineCategory = action.payload.selectedEngineCategory;

      if (selectedEngineCategory.categoryType === 'face') {
        yield put(cancelFaceEdits());
      } else if (selectedEngineCategory.categoryType === 'transcript') {
        yield put(resetTranscript());
      }
    }
  });
}

export default function* root() {
  yield all([
    fork(watchLoadEngineResultsRequest),
    fork(watchLoadEngineResultsComplete),
    fork(watchLoadTdoRequest),
    fork(watchUpdateTdoRequest),
    fork(watchSetEngineId),
    fork(watchSelectEngineCategory),
    fork(watchLoadContentTemplates),
    fork(watchUpdateTdoContentTemplates),
    fork(watchTranscriptStatus),
    fork(watchFaceEngineEntityUpdate),
    fork(watchSaveAssetData),
    fork(watchCreateFileAssetSuccess),
    fork(watchCancelEdit)
  ]);
}
