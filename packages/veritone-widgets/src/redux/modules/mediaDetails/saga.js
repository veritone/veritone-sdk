import { fork, all, call, put, takeEvery, select } from 'redux-saga/effects';
import { get, uniq } from 'lodash';
import { modules } from 'veritone-redux-common';
const { auth: authModule, config: configModule } = modules;

import callGraphQLApi from '../../../shared/callGraphQLApi';
import {
  LOAD_ENGINE_RESULTS,
  LOAD_ENGINE_RESULTS_SUCCESS,
  LOAD_TDO,
  UPDATE_TDO,
  LOAD_CONTENT_TEMPLATES,
  UPDATE_TDO_CONTENT_TEMPLATES,
  UPDATE_TDO_CONTENT_TEMPLATES_FAILURE,
  SET_SELECTED_ENGINE_ID,
  SELECT_ENGINE_CATEGORY,
  REQUEST_LIBRARIES,
  REQUEST_LIBRARIES_SUCCESS,
  REQUEST_LIBRARIES_FAILURE,
  REQUEST_ENTITIES,
  REQUEST_ENTITIES_SUCCESS,
  REQUEST_ENTITIES_FAILURE,
  REQUEST_SCHEMAS,
  REQUEST_SCHEMAS_SUCCESS,
  REQUEST_SCHEMAS_FAILURE,
  loadEngineCategoriesSuccess,
  loadEngineCategoriesFailure,
  loadEngineResultsRequest,
  loadEngineResultsSuccess,
  loadEngineResultsFailure,
  loadTdoSuccess,
  updateTdoSuccess,
  loadContentTemplatesSuccess,
  loadContentTemplatesFailure,
  loadTdoContentTemplatesSuccess,
  loadTdoContentTemplatesFailure,
  selectEngineCategory,
  setEngineId,
  getTdo,
  getEngineResultRequestsByEngineId
} from '.';

const tdoInfoQueryClause = `id
    details
    startDateTime
    stopDateTime
    applicationId
    security {
      global
    }
    primaryAsset(assetType: "media") {
      id
      uri
    }
    streams {
      protocol
      uri
    }`;

function* finishLoadEngineCategories(widgetId, result, { error }) {
  if (error) {
    return yield put(loadEngineCategoriesFailure(widgetId, { error }));
  }
  return yield put(loadEngineCategoriesSuccess(widgetId, result));
}

function* finishLoadTdo(widgetId, result, { warning, error }) {
  yield put(loadTdoSuccess(widgetId, result, { warning, error }));
}

function* finishUpdateTdo(widgetId, result, { warning, error }) {
  yield put(updateTdoSuccess(widgetId, result, { warning, error }));
}

function* loadTdoSaga(widgetId, tdoId) {
  const getTdoQuery = `query temporalDataObject($tdoId: ID!){
      temporalDataObject(id: $tdoId) {
        ${tdoInfoQueryClause}
        # Run engines and categories query clauses
        engineRuns {
          records {
            engine {
              id
              name
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
    return yield* finishLoadTdo(widgetId, null, { error });
  }

  if (!response || !response.data || !response.data.temporalDataObject) {
    console.warn('TemporalDataObject not found');
    return yield* finishLoadTdo(widgetId, response.data.temporalDataObject, {
      error: 'TemporalDataObject not found'
    });
  }

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

  const tdo = response.data.temporalDataObject;
  let engineCategories = [];

  // Extract EngineCategories data from EngineRuns
  if (get(tdo, 'engineRuns.records', false)) {
    tdo.engineRuns.records
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
        engineCategory.engines.push(engineRun.engine);
      });
  }

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

  delete tdo.jobs;
  delete tdo.assets;

  yield* finishLoadTdo(widgetId, tdo, {
    warning: false,
    error: false
  });

  yield* finishLoadEngineCategories(widgetId, engineCategories, {
    error: false
  });
  if (engineCategories.length) {
    yield put(selectEngineCategory(widgetId, engineCategories[0]));
  }
  // initiate loading content templates for this tdo
  yield call(loadTdoContentTemplatesSaga, widgetId);
}

function* updateTdoSaga(widgetId, tdoId, tdoDataToUpdate) {
  const updateTdoQuery = `mutation updateTDO($tdoId: ID!){
      updateTDO( input: {
        id: $tdoId
        ${tdoDataToUpdate}
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
      variables: { tdoId },
      token
    });
  } catch (error) {
    return yield* finishUpdateTdo(widgetId, null, { error });
  }

  if (response.errors && response.errors.length) {
    response.errors.forEach(error => console.warn(error));
  }

  if (!response || !response.data || !response.data.updateTDO) {
    console.warn('TemporalDataObject not found after update');
  }

  yield* finishUpdateTdo(widgetId, response.data.updateTDO, {
    warning: false,
    error: false
  });
}

function* loadEngineResultsSaga(
  widgetId,
  engineId,
  startOffsetMs,
  stopOffsetMs
) {
  const getEngineResultsQuery = `query engineResults($tdoId: ID!, $engineIds: [ID!]!, $startOffsetMs: Int, $stopOffsetMs: Int) {
      engineResults(id: $tdoId, engineIds: $engineIds, startOffsetMs: $startOffsetMs, stopOffsetMs: $stopOffsetMs) {
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
    return yield put(loadEngineResultsFailure({ error, startOffsetMs, stopOffsetMs, engineId, widgetId }));
  }

  yield put(
    loadEngineResultsSuccess(response.data.engineResults.records, {
      startOffsetMs,
      stopOffsetMs,
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
        source
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

  if (response.errors && response.errors.length) {
    response.errors.forEach(error => console.warn(error));
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
    return yield put(
      loadTdoContentTemplatesFailure(widgetId, { error })
    );
  }

  if (response.errors && response.errors.length) {
    response.errors.forEach(error => console.warn(error));
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

  if (response.errors && response.errors.length) {
    response.errors.forEach(error =>
      console.error('Failed to update content template: ' + error)
    );
    yield put({
      type: UPDATE_TDO_CONTENT_TEMPLATES_FAILURE,
      error: 'Error updating content templates.'
    });
  }

  yield call(loadTdoContentTemplatesSaga, widgetId);
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
  if (get(response, 'errors.length', 0)) {
    response.errors.forEach(error => errors.push(error));
  }

  if (errors.length) {
    return { errors };
  }

  return {};
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
    if (get(response, 'errors.length', 0)) {
      response.errors.forEach(error => errors.push(error));
    }
  }

  if (errors.length) {
    return { errors };
  }

  return {};
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

function* fetchLibraries(widgetId, libraryIds) {
  yield put({ type: REQUEST_LIBRARIES, meta: { widgetId } });
  let libraryQueries = libraryIds.map((id, index) => {
    return `
      library${index}: library(id:"${id}") {
        id
        name
        description
        coverImageUrl
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
      query: `query{${libraryQueries.join(' ')}}`,
      token
    });
  } catch (error) {
    yield put({
      type: REQUEST_LIBRARIES_FAILURE,
      error: 'Error fetching libraries from server.'
    });
  }

  if (response.errors) {
    yield put({
      type: REQUEST_LIBRARIES_FAILURE,
      error: 'Error thrown by GraphQL while fetching libraries',
      meta: { widgetId }
    });
  } else {
    yield put({
      type: REQUEST_LIBRARIES_SUCCESS,
      payload: response.data,
      meta: { widgetId }
    });
  }
}

function* fetchEntities(widgetId, entityIds) {
  yield put({ type: REQUEST_ENTITIES, meta: { widgetId } });
  let entityQueries = entityIds.map((id, index) => {
    return `
      entity${index}: entity(id:"${id}") {
        id
        name
        libraryId
        profileImageUrl
        jsondata
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
    yield put({
      type: REQUEST_ENTITIES_FAILURE,
      error: 'Error fetching entities from server.'
    });
  }

  if (response.errors) {
    yield put({
      type: REQUEST_ENTITIES_FAILURE,
      error: 'Error thrown while fetching entities',
      meta: { widgetId }
    });
  } else {
    yield put({
      type: REQUEST_ENTITIES_SUCCESS,
      payload: response.data,
      meta: { widgetId }
    });
  }
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
    yield put({
      type: REQUEST_SCHEMAS_FAILURE,
      error: 'Error fetching schemas from server.'
    });
  }

  if (response.errors) {
    yield put({
      type: REQUEST_SCHEMAS_FAILURE,
      error: 'Error thrown while fetching schemas',
      meta: { widgetId }
    });
  } else {
    yield put({
      type: REQUEST_SCHEMAS_SUCCESS,
      payload: response.data,
      meta: { widgetId }
    });
  }
}

function* watchLoadEngineResultsComplete() {
  yield takeEvery(LOAD_ENGINE_RESULTS_SUCCESS, function*(action) {
    let libraryIds = [],
      entityIds = [],
      schemaIds = [];
    action.payload.forEach(jsonData => {
      jsonData.jsondata.series.forEach(s => {
        let entityId = get(s, 'object.entityId');
        if (entityId) {
          entityIds.push(entityId);
        }
        let libraryId = get(s, 'object.libraryId');
        if (libraryId) {
          libraryIds.push(libraryId);
        }
        let structuredData = get(s, 'structuredData');
        if (structuredData) {
          Object.keys(structuredData).forEach(schemaId =>
            schemaIds.push(schemaId)
          );
        }
      });
    });

    if (libraryIds.length && entityIds.length) {
      yield all([
        call(fetchLibraries, action.meta.widgetId, uniq(libraryIds)),
        call(fetchEntities, action.meta.widgetId, uniq(entityIds))
      ]);
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

function* watchUpdateTdoRequest() {
  yield takeEvery(UPDATE_TDO, function*(action) {
    const { tdoId, tdoDataToUpdate } = action.payload;
    const { widgetId } = action.meta;
    yield call(updateTdoSaga, widgetId, tdoId, tdoDataToUpdate);
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

export default function* root() {
  yield all([
    fork(watchLoadEngineResultsRequest),
    fork(watchLoadEngineResultsComplete),
    fork(watchLoadTdoRequest),
    fork(watchUpdateTdoRequest),
    fork(watchSetEngineId),
    fork(watchSelectEngineCategory),
    fork(watchLoadContentTemplates),
    fork(watchUpdateTdoContentTemplates)
  ]);
}
