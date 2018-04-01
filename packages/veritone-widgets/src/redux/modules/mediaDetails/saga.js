import { fork, all, call, put, takeEvery, select } from 'redux-saga/effects';
import { noop } from 'lodash';

import { modules } from 'veritone-redux-common';
const { auth: authModule, config: configModule } = modules;

import callGraphQLApi from '../../../shared/callGraphQLApi';
import {
  LOAD_ENGINE_CATEGORIES,
  LOAD_ENGINE_RESULTS,
  LOAD_TDO,
  UPDATE_TDO,
  loadEngineCategoriesComplete,
  loadEngineResultsComplete,
  loadTdoSuccess,
  updateTdoComplete,
  selectEngineCategory
} from '.';

function* finishLoadEngineCategories(
  widgetId,
  result,
  { warning, error },
  callback
) {
  yield put(loadEngineCategoriesComplete(widgetId, result, { warning, error }));
  yield call(callback, result, { warning, error, cancelled: false });
}

function* finishLoadEngineResults(
  widgetId,
  result,
  { warning, error },
  callback
) {
  yield put(loadEngineResultsComplete(widgetId, result, { warning, error }));
  yield call(callback, result, { warning, error, cancelled: false });
}

function* finishLoadTdo(widgetId, result, { warning, error }, callback) {
  yield put(loadTdoSuccess(widgetId, result, { warning, error }));
  yield call(callback, result, { warning, error, cancelled: false });
}

function* finishUpdateTdo(widgetId, result, { warning, error }, callback) {
  yield put(updateTdoComplete(widgetId, result, { warning, error }));
  yield call(callback, result, { warning, error, cancelled: false });
}

function* loadEngineCategoriesSaga(widgetId, tdoId) {
  const getTasksAndStatusesQuery = `query temporalDataObject($tdoId: ID!){
      temporalDataObject(id: $tdoId) {
        jobs {
          records {
            tasks (limit: 1000, status: complete ) {
              records {
                completedDateTime
                engine {
                  id 
                  name
                  category {
                    id
                    name
                    iconClass
                    editable
                    categoryType
                  }
                }
              }
            }
          }
        }
      }
    }`;

  // array of categories that Media Details does not support
  const unsupportedCategories = [
    'conductor',
    'reducer',
    'thumbnail',
    'transcode'
  ];

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  let response;
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: getTasksAndStatusesQuery,
      variables: { tdoId },
      token
    });
  } catch (error) {
    return yield* finishLoadEngineCategories(widgetId, null, { error });
  }

  if (!response || !response.data || !response.data.temporalDataObject) {
    console.warn('TemporalDataObject not found');
  }

  if (response.errors && response.errors.length) {
    const isMissingEngineCategoryError = function(error) {
      return (
        error.name === 'not_found' &&
        error.data &&
        error.data.objectType === 'EngineCategory'
      );
    };
    response.errors
      .filter(error => !isMissingEngineCategoryError(error))
      .forEach(error => console.warn(error));
  }

  let engineCategories = [];

  // Convert data from tasks to EngineCategories
  // {
  //  name
  //  id
  //  editable
  //  iconClass
  //  engines [{
  //    id
  //    name
  //    completedDateTime
  //    }
  //  ]}
  const tdo = response.data.temporalDataObject;
  if (tdo && tdo.jobs && tdo.jobs.records) {
    const engineCategoryById = new Map();
    // filter out unique engines per engine category
    tdo.jobs.records.forEach(job => {
      if (!job.tasks || !job.tasks.records) {
        return;
      }
      job.tasks.records
        .filter(
          task =>
            task.engine &&
            task.engine.category &&
            task.engine.category.iconClass &&
            !unsupportedCategories.some(
              categoryType => categoryType === task.engine.category.categoryType
            )
        )
        .forEach(task => {
          let engineCategory = engineCategoryById.get(task.engine.category.id);
          if (!engineCategory) {
            engineCategory = Object.assign({}, task.engine.category);
            engineCategory.iconClass = engineCategory.iconClass.replace(
              '-engine',
              ''
            );
            engineCategory.engines = [];
            engineCategoryById.set(engineCategory.id, engineCategory);
          }

          const engineFromTask = {};
          engineFromTask.id = task.engine.id;
          engineFromTask.name = task.engine.name;
          engineFromTask.completedDateTime = Number(task.completedDateTime);

          const filteredEngineIdx = engineCategory.engines.findIndex(
            filteredEngine => filteredEngine.id === engineFromTask.id
          );
          if (filteredEngineIdx === -1) {
            engineCategory.engines.push(engineFromTask);
          } else if (
            engineFromTask.completedDateTime >
            engineCategory.engines[filteredEngineIdx].completedDateTime
          ) {
            // consider only the latest run engine, disregard previous runs
            engineCategory.engines[filteredEngineIdx] = engineFromTask;
          }
        });
    });

    // list all categories
    const filteredCategories = [];
    const categoriesIterator = engineCategoryById.values();
    let nextCategory = categoriesIterator.next();
    while (!nextCategory.done) {
      filteredCategories.push(nextCategory.value);
      nextCategory = categoriesIterator.next();
    }
    engineCategories = filteredCategories;
  }

  // order categories first must go most frequently used (ask PMs), the rest - alphabetically
  engineCategories.sort((category1, category2) => {
    if (category1.categoryType < category2.categoryType) {
      return -1;
    }
    if (category1.categoryType > category2.categoryType) {
      return 1;
    }
    return 0;
  });
  const orderedCategoryTypes = [
    'transcript',
    'face',
    'object',
    'logo',
    'ocr',
    'fingerprint',
    'translate',
    'sentiment',
    'geolocation',
    'stationPlayout',
    'music'
  ];
  orderedCategoryTypes.reverse().forEach(orderedCategoryType => {
    const index = engineCategories.findIndex(
      category => category.categoryType === orderedCategoryType
    );
    if (index >= 0) {
      const category = engineCategories[index];
      engineCategories.splice(index, 1);
      engineCategories.unshift(category);
    }
  });

  yield put(selectEngineCategory(widgetId, engineCategories[0]));

  yield* finishLoadEngineCategories(widgetId, engineCategories, {
    warning: false,
    error: false
  });
}

function* loadEngineResultsSaga(
  widgetId,
  tdoId,
  engineId,
  startOffsetMs,
  stopOffsetMs,
  callback = noop
) {
  const getMetadataQuery = `query engineResults($id: ID!, $engineIds: [ID!], $startOffsetMs: DateTime, $stopOffsetMs: DateTime) {
      engineResults(id: $id, engineIds: $engineIds, startOffsetMs: $startOffsetMs, stopOffsetMs: $stopOffsetMs) {
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

  let response;
  try {
    const engineIds = [engineId];
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: getMetadataQuery,
      variables: { tdoId, engineIds, startOffsetMs, stopOffsetMs },
      token
    });
  } catch (error) {
    return yield* finishLoadEngineResults(widgetId, null, { error }, callback);
  }

  if (response.errors && response.errors.length) {
    response.errors.forEach(error => console.warn(error));
  }

  yield* finishLoadEngineResults(
    widgetId,
    response.data.engineResults.records,
    {
      warning: false,
      error: false
    },
    callback
  );
}

function* loadTdoSaga(widgetId, tdoId, callback = noop) {
  const getTdoQuery = `query temporalDataObject($tdoId: ID!){
      temporalDataObject(id: $tdoId) {
        id
        details
        startDateTime
        stopDateTime
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
      query: getTdoQuery,
      variables: { tdoId },
      token
    });
  } catch (error) {
    return yield* finishLoadTdo(widgetId, null, { error }, callback);
  }

  if (response.errors && response.errors.length) {
    response.errors.forEach(error => console.warn(error));
  }

  if (!response || !response.data || !response.data.temporalDataObject) {
    console.warn('TemporalDataObject not found');
  }

  yield* finishLoadTdo(
    widgetId,
    response.data.temporalDataObject,
    {
      warning: false,
      error: false
    },
    callback
  );
}

function* updateTdoSaga(widgetId, tdoId, tdoDataToUpdate, callback = noop) {
  const updateTdoQuery = `mutation updateTDO($tdoId: ID!){
      updateTDO( input: {
        id: $tdoId
        ${tdoDataToUpdate}
      })
      {
        id
        details
        startDateTime
        stopDateTime
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
    return yield* finishUpdateTdo(widgetId, null, { error }, callback);
  }

  if (response.errors && response.errors.length) {
    response.errors.forEach(error => console.warn(error));
  }

  if (!response || !response.data || !response.data.updateTDO) {
    console.warn('TemporalDataObject not found after update');
  }

  yield* finishUpdateTdo(
    widgetId,
    response.data.updateTDO,
    {
      warning: false,
      error: false
    },
    callback
  );
}

function* watchLoadEngineCategoriesRequest() {
  yield takeEvery(LOAD_ENGINE_CATEGORIES, function*(action) {
    const { tdoId, callback } = action.payload;
    const { widgetId } = action.meta;
    yield call(loadEngineCategoriesSaga, widgetId, tdoId, callback);
  });
}

function* watchLoadEngineResultsRequest() {
  yield takeEvery(LOAD_ENGINE_RESULTS, function*(action) {
    const {
      tdoId,
      engineId,
      startOffsetMs,
      stopOffsetMs,
      callback
    } = action.payload;
    const { widgetId } = action.meta;
    yield call(
      loadEngineResultsSaga,
      widgetId,
      tdoId,
      engineId,
      startOffsetMs,
      stopOffsetMs,
      callback
    );
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
    const { tdoId, tdoDataToUpdate, callback } = action.payload;
    const { widgetId } = action.meta;
    yield call(updateTdoSaga, widgetId, tdoId, tdoDataToUpdate, callback);
  });
}

export default function* root() {
  yield all([
    fork(watchLoadEngineCategoriesRequest),
    fork(watchLoadEngineResultsRequest),
    fork(watchLoadTdoRequest),
    fork(watchUpdateTdoRequest)
  ]);
}
