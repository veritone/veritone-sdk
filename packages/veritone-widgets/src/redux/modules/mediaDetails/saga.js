import {
  fork,
  all,
  call,
  put,
  takeEvery,
  select,
  take,
  takeLatest
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
  get,
  uniq,
  union,
  isObject,
  isEmpty,
  isUndefined,
  isArray,
  every,
  forEach,
  find,
  includes
} from 'lodash';
import { helpers, modules } from 'veritone-redux-common';
import {
  getFaceEngineAssetData,
  cancelFaceEdits,
  pendingUserEdits,
  ADD_DETECTED_FACE,
  REMOVE_DETECTED_FACE,
  CANCEL_FACE_EDITS
} from './faceEngineOutput';
import {
  getTranscriptEditAssetData,
  reset as resetTranscript
} from './transcriptWidget';
const {
  auth: authModule,
  config: configModule,
  application: applicationModule,
  engineResults: engineResultsModule
} = modules;
// TODO: refactor to use callGraphQLApi
const { fetchGraphQLApi } = helpers;
import uploadFilesChannel from '../../../shared/uploadFilesChannel';
import {
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
  RESTORE_ORIGINAL_ENGINE_RESULTS,
  loadEngineCategoriesSuccess,
  loadEngineCategoriesFailure,
  loadTdoRequest,
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
  toggleSaveMode,
  saveAssetDataFailure,
  saveAssetDataSuccess,
  createFileAssetSuccess,
  createFileAssetFailure,
  createBulkEditTranscriptAssetFailure,
  createBulkEditTranscriptAssetSuccess,
  isEditModeEnabled,
  toggleEditMode,
  getSelectedEngineCategory,
  refreshEngineRunsSuccess,
  setEditButtonState,
  getSelectedEngineId,
  restoreOriginalEngineResultsFailure,
  restoreOriginalEngineResultsSuccess
} from '.';

import { UPDATE_EDIT_STATUS } from './transcriptWidget';
import { LOAD_TDO_SUCCESS, REFRESH_ENGINE_RUNS_SUCCESS } from './index';

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

const engineRunsQueryClause = `engineRuns(limit: 1000) {
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
            exportFormats {
              format
              label
              types
            }
          }
        }
        status
        hasUserEdits
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

  engineRuns
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
      engineRun.engine.hasUserEdits = engineRun.hasUserEdits;
      engineCategory.engines.push(engineRun.engine);
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
    response = yield call(fetchGraphQLApi, {
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
    response = yield call(fetchGraphQLApi, {
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

  yield* refreshSelectedEngineResultsOnStatusChange(widgetId, engineCategories);

  yield* finishLoadEngineCategories(widgetId, engineCategories, {
    error: false
  });

  yield put(refreshEngineRunsSuccess(engineRuns, widgetId));
}

function* updateTdoSaga(widgetId, tdoId, tdoDetailsToUpdate, primaryAssetData) {
  const updateTdoQuery = `mutation updateTDO($tdoId: ID!, $details: JSONData, $primaryAsset: [SetPrimaryAsset!]){
      updateTDO( input: {
        id: $tdoId
        details: $details
        primaryAsset: $primaryAsset
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
    response = yield call(fetchGraphQLApi, {
      endpoint: graphQLUrl,
      query: updateTdoQuery,
      variables: {
        tdoId,
        details: !isEmpty(tdoDetailsToUpdate) ? tdoDetailsToUpdate : null,
        primaryAsset: !isEmpty(primaryAssetData) ? primaryAssetData : null
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
  yield call(insertIntoIndexSaga, tdoId);
}

function* loadContentTemplates(widgetId) {
  let loadTemplatesQuery = `query {
    dataRegistries(filterByOwnership: mine) {
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
    response = yield call(fetchGraphQLApi, {
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
    response = yield call(fetchGraphQLApi, {
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
      response = yield call(fetchGraphQLApi, {
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
    response = yield call(fetchGraphQLApi, {
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
  fileData,
  isUserEdited
) {
  const requestTdo = yield select(getTdo, widgetId);
  const createAssetQuery = `mutation createAsset(
    $tdoId: ID!,
    $type: String,
    $contentType: String,
    $file: UploadedFile,
    $sourceData: SetAssetSourceData,
    $isUserEdited: Boolean
  ){
    createAsset( input: {
      containerId: $tdoId,
      type: $type,
      contentType: $contentType,
      sourceData: $sourceData,
      file: $file,
      isUserEdited: $isUserEdited
    })
    { id }
  }`;

  const variables = {
    tdoId: requestTdo.id,
    type,
    contentType,
    file: fileData,
    sourceData,
    isUserEdited
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
    const selectedEngineId = yield select(getSelectedEngineId, widgetId);
    yield put(
      engineResultsModule.fetchEngineResults({
        tdo: requestTdo,
        engineId: selectedEngineId,
        startOffsetMs: 0,
        stopOffsetMs:
          Date.parse(requestTdo.stopDateTime) -
          Date.parse(requestTdo.startDateTime),
        ignoreUserEdited: false
      })
    );
    yield put(toggleEditMode(widgetId, selectedEngineCategory));
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
      text,
      false
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
    getPrimaryTranscriptAssetResponse = yield call(fetchGraphQLApi, {
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
    try {
      const vtnStandardAssets = yield call(
        fetchAssets,
        requestTdo.id,
        'vtn-standard'
      );
      const transcriptVtnAsset = vtnStandardAssets.find(
        asset => get(asset, 'sourceData.engineId') === selectedEngineId
      );
      originalTranscriptAssetId = get(transcriptVtnAsset, 'id');
    } catch (error) {
      return yield put(
        createBulkEditTranscriptAssetFailure(widgetId, { error })
      );
    }
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
          originalEngineId: "${selectedEngineId}",
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
      status
      tasks {
        records {
          id
        }
      }
    }
  }`;

  let runBulkEditJobResponse;
  try {
    runBulkEditJobResponse = yield call(fetchGraphQLApi, {
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
    get(runBulkEditJobResponse, 'data.createJob.tasks.records[0].status') ===
    'failed'
  ) {
    return yield put(
      createBulkEditTranscriptAssetFailure(widgetId, {
        error:
          'Failed to create task for bulk-edit-transcript job. Failed to save bulk transcript edit.'
      })
    );
  }
  yield put(createBulkEditTranscriptAssetSuccess(widgetId));
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
    response = yield call(fetchGraphQLApi, {
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

function* fetchSchemas(schemaIds) {
  yield put({ type: REQUEST_SCHEMAS });
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
    response = yield call(fetchGraphQLApi, {
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
      error: 'Error thrown while fetching schemas'
    });
  }
  return yield put({
    type: REQUEST_SCHEMAS_SUCCESS,
    payload: response.data
  });
}

function* fetchAssets(tdoId, assetType) {
  const getVtnStandardAssetsQuery = `query temporalDataObject($tdoId: ID!){
        temporalDataObject(id: $tdoId) {
          assets (limit: 1000, type: "${assetType}", orderBy: createdDateTime) {
            records {
              id
              isUserEdited
              sourceData {
                engineId
              }
              jsondata
            }
          }
        }
      }`;
  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const sessionToken = yield select(authModule.selectSessionToken);
  const oauthToken = yield select(authModule.selectOAuthToken);
  const token = sessionToken || oauthToken;
  let getVtnStandardAssetsResponse = yield call(fetchGraphQLApi, {
    endpoint: graphQLUrl,
    query: getVtnStandardAssetsQuery,
    variables: { tdoId: tdoId },
    token
  });
  return get(
    getVtnStandardAssetsResponse,
    'data.temporalDataObject.assets.records',
    []
  );
}

function* watchRestoreOriginalEngineResults() {
  yield takeEvery(RESTORE_ORIGINAL_ENGINE_RESULTS, function*(action) {
    const { widgetId } = action.meta;
    const {
      tdo,
      engineId,
      engineCategoryType,
      removeAllUserEdits
    } = action.payload;

    // these could be partial or fully retrieved data from assets
    const fetchedEngineResultsToDelete = get(
      action.payload,
      'engineResults',
      []
    ).filter(jsonData => jsonData.userEdited && !!jsonData.assetId);
    const fetchedAssetIdsToDelete = fetchedEngineResultsToDelete.map(
      jsonData => jsonData.assetId
    );

    // list all user edited vtn-standard assets for this tdo and engine
    let userEditedVtnAssetIdsToDelete = [];
    if (removeAllUserEdits) {
      try {
        let engineIds = fetchedEngineResultsToDelete.map(
          engineResult => engineResult.sourceEngineId
        );
        if (engineId) {
          engineIds.push(engineId);
        }
        engineIds = uniq(engineIds);
        const vtnStandardAssets = yield call(
          fetchAssets,
          tdo.id,
          'vtn-standard'
        );
        userEditedVtnAssetIdsToDelete = vtnStandardAssets
          .filter(
            asset =>
              asset.isUserEdited &&
              includes(engineIds, get(asset, 'sourceData.engineId'))
          )
          .map(asset => asset.id);
      } catch (error) {
        return yield put(
          restoreOriginalEngineResultsFailure(widgetId, { error })
        );
      }
    }

    // handle ttml assets if restoring transcript edit - delete manually edited and set new primary
    let ttmlUserEditedAssetIdsToDelete = [];
    if (engineCategoryType === 'transcript') {
      const ttmlTranscriptAssets = yield call(
        fetchAssets,
        tdo.id,
        'transcript'
      );
      let userEditedTtmlAssets = [];
      if (removeAllUserEdits) {
        userEditedTtmlAssets = ttmlTranscriptAssets.filter(
          asset => get(asset, 'jsondata.source') === 'manual'
        );
      } else {
        userEditedTtmlAssets = ttmlTranscriptAssets.filter(asset =>
          fetchedAssetIdsToDelete.includes(asset.id)
        );
      }
      if (userEditedTtmlAssets.length) {
        ttmlUserEditedAssetIdsToDelete = userEditedTtmlAssets.map(
          asset => asset.id
        );
        // the new primary ttml asset should be the most recent non user-edited asset
        const newPrimaryTtmlAsset = ttmlTranscriptAssets.find(
          asset => get(asset, 'jsondata.source') !== 'manual'
        );
        if (newPrimaryTtmlAsset) {
          yield call(updateTdoSaga, widgetId, tdo.id, null, {
            id: newPrimaryTtmlAsset.id,
            assetType: 'transcript'
          });
        } else {
          yield put(
            restoreOriginalEngineResultsFailure(widgetId, {
              error:
                'Cannot delete user edited ttml asset. No primary asset found to set.'
            })
          );
        }
      }
    }

    const assetsToDelete = union(
      fetchedAssetIdsToDelete,
      userEditedVtnAssetIdsToDelete,
      ttmlUserEditedAssetIdsToDelete
    );
    if (!assetsToDelete.length) {
      return;
    }

    const deleteAssetsResponse = yield call(deleteAssetsSaga, assetsToDelete);
    if (deleteAssetsResponse.errors) {
      // report errors and continue refetching engine results and runs
      yield put(
        restoreOriginalEngineResultsFailure(widgetId, {
          error:
            'Errors deleting user edited engine results for selected engine'
        })
      );
    }

    yield call(refreshEngineRuns, widgetId, tdo.id);

    yield put(
      engineResultsModule.fetchEngineResults({
        tdo,
        engineId,
        startOffsetMs: 0,
        stopOffsetMs:
          Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime)
      })
    );

    yield call(insertIntoIndexSaga, tdo.id);
    yield put(restoreOriginalEngineResultsSuccess(widgetId));
  });
}

function* watchLoadEngineResultsComplete() {
  yield takeEvery(engineResultsModule.FETCH_ENGINE_RESULTS_SUCCESS, function*(
    action
  ) {
    let entityIds = [],
      schemaIds = [];
    get(action, 'payload.engineResults.records', []).forEach(record => {
      get(record, 'jsondata.series', []).forEach(s => {
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
      yield call(fetchSchemas, uniq(schemaIds));
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
    signedWritableUrlResponse = yield call(fetchGraphQLApi, {
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
    const selectedEngineCategory = yield select(
      getSelectedEngineCategory,
      widgetId
    );

    // Ignore face engine results because the FaceEngineOutput handles it's own fetching
    if (!selectedEngineId || selectedEngineCategory.categoryType === 'face') {
      return;
    }

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

    if (startOffsetMs > stopOffsetMs) {
      return;
    }

    yield put(
      engineResultsModule.fetchEngineResults({
        tdo: currentTdo,
        engineId: selectedEngineId,
        startOffsetMs,
        stopOffsetMs,
        ignoreUserEdited: false
      })
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

function* watchFaceEngineEntityUpdate(widgetId) {
  yield takeEvery(
    [ADD_DETECTED_FACE, REMOVE_DETECTED_FACE, CANCEL_FACE_EDITS],
    function*(action) {
      const selectedEngineId = yield select(getSelectedEngineId, widgetId);
      const hasPendingFaceEdits = yield select(
        pendingUserEdits,
        selectedEngineId
      );
      yield put(toggleSaveMode(hasPendingFaceEdits));
    }
  );
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
      if (assetData.text) {
        const contentType = 'text/plain';
        const type = 'bulk-edit-transcript';
        const { widgetId } = action.meta;
        const sourceData = {};
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
    const { widgetId } = action.meta;
    const createAssetCalls = [];
    forEach(assetData, jsonData => {
      if (get(jsonData, 'series.length')) {
        forEach(jsonData.series, asset => {
          if (get(asset, 'object.uri')) {
            asset.object.uri = removeAwsSignatureParams(
              get(asset, 'object.uri')
            );
          }
          delete asset.guid;
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
      createAssetCalls.push(
        call(
          createFileAssetSaga,
          widgetId,
          type,
          contentType,
          sourceData,
          jsonData,
          true
        )
      );
    });
    yield all(createAssetCalls);
    yield put(saveAssetDataSuccess(widgetId));
  });
}

function* watchCreateFileAssetSuccess() {
  yield takeEvery(
    action => action.type === CREATE_FILE_ASSET_SUCCESS,
    function* insertIntoIndex(action) {
      const { widgetId } = action.meta;
      const tdo = yield select(getTdo, widgetId);
      return yield call(insertIntoIndexSaga, tdo.id);
    }
  );
}

function* insertIntoIndexSaga(tdoId) {
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

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const sessionToken = yield select(authModule.selectSessionToken);
  const oauthToken = yield select(authModule.selectOAuthToken);
  const token = sessionToken || oauthToken;

  try {
    const response = yield call(fetchGraphQLApi, {
      endpoint: graphQLUrl,
      query: createJobQuery,
      variables: { tdoId: tdoId },
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

function* watchLatestFetchEngineResultsStart(widgetId) {
  yield takeLatest([engineResultsModule.FETCH_ENGINE_RESULTS], function*() {
    yield put(setEditButtonState(widgetId, true));
  });
}

function* watchLatestFetchEngineResultsEnd(widgetId) {
  yield takeLatest(
    [
      engineResultsModule.FETCH_ENGINE_RESULTS_SUCCESS,
      engineResultsModule.FETCH_ENGINE_RESULTS_FAILURE
    ],
    function*() {
      yield put(setEditButtonState(widgetId, false));
    }
  );
}

function* refreshSelectedEngineResultsOnStatusChange(
  widgetId,
  engineCategoriesNewValue
) {
  const requestTdo = yield select(getTdo, widgetId);
  const selectedEngineId = yield select(getSelectedEngineId, widgetId);
  const selectedEngineCategoryOldValue = yield select(
    getSelectedEngineCategory,
    widgetId
  );
  const selectedEngineCategoryNewValue = find(engineCategoriesNewValue, {
    id: selectedEngineCategoryOldValue.id
  });
  const selectedEngineOldValue = find(
    get(selectedEngineCategoryOldValue, 'engines', []),
    {
      id: selectedEngineId
    }
  );
  const selectedEngineNewValue = find(
    get(selectedEngineCategoryNewValue, 'engines', []),
    {
      id: selectedEngineId
    }
  );
  const engineMode = get(selectedEngineNewValue, 'mode');
  const engineStatusOldValue = get(selectedEngineOldValue, 'status');
  const engineStatusNewValue = get(selectedEngineNewValue, 'status');
  const isRealTimeEngine =
    engineMode &&
    (engineMode.toLowerCase() === 'stream' ||
      engineMode.toLowerCase() === 'chunk');
  const isRealTimeStillRunning =
    isRealTimeEngine && engineStatusNewValue === 'running';
  const isRealTimeFinishedRunning =
    isRealTimeEngine &&
    engineStatusOldValue === 'running' &&
    engineStatusNewValue !== 'running';
  const wentToCompletedStatus =
    engineStatusOldValue &&
    engineStatusOldValue !== 'complete' &&
    engineStatusNewValue === 'complete';
  if (
    isRealTimeStillRunning ||
    isRealTimeFinishedRunning ||
    wentToCompletedStatus
  ) {
    engineResultsModule.fetchEngineResults({
      tdo: requestTdo,
      engineId: selectedEngineId
    });
  }
}

function* watchToStartRefreshEngineRunsWithTimeout(
  widgetId,
  refreshIntervalMs
) {
  yield takeLatest(
    [LOAD_TDO_SUCCESS, REFRESH_ENGINE_RUNS_SUCCESS],
    function*() {
      if (refreshIntervalMs > 0) {
        const requestTdo = yield select(getTdo, widgetId);
        yield delay(refreshIntervalMs);
        yield call(refreshEngineRuns, widgetId, requestTdo.id);
      }
    }
  );
}

function* onMount(id, mediaId) {
  yield put(loadTdoRequest(id, mediaId));
  yield put(applicationModule.fetchApplications());
}

export default function* root({ id, mediaId, refreshIntervalMs }) {
  yield all([
    fork(watchLoadEngineResultsComplete),
    fork(watchLoadTdoRequest),
    fork(watchUpdateTdoRequest),
    fork(watchSetEngineId),
    fork(watchSelectEngineCategory),
    fork(watchLoadContentTemplates),
    fork(watchUpdateTdoContentTemplates),
    fork(watchTranscriptStatus),
    fork(watchFaceEngineEntityUpdate, id),
    fork(watchSaveAssetData),
    fork(watchCreateFileAssetSuccess),
    fork(watchCancelEdit),
    fork(watchLatestFetchEngineResultsStart, id),
    fork(watchLatestFetchEngineResultsEnd, id),
    fork(watchRestoreOriginalEngineResults),
    fork(watchToStartRefreshEngineRunsWithTimeout, id, refreshIntervalMs),
    fork(onMount, id, mediaId)
  ]);
}
