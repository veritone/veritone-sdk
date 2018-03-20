import {
  fork,
  all,
  call,
  put,
  takeEvery,
  select
} from 'redux-saga/effects';
import { noop } from 'lodash';

import { modules } from 'veritone-redux-common';
const { auth: authModule, config: configModule } = modules;

import callGraphQLApi from '../../../shared/callGraphQLApi';
import { LOAD_ENGINE_CATEGORIES, loadEngineCategoriesComplete } from '.';
import { LOAD_TDO, loadTdoComplete } from '.';

function* finishLoadEngineCategories(widgetId, result, { warning, error }, callback) {
  yield put(loadEngineCategoriesComplete(widgetId, result, { warning, error }));
  yield call(callback, result, { warning, error, cancelled: false });
}

function* finishLoadTdo(widgetId, result, { warning, error }, callback) {
  yield put(loadTdoComplete(widgetId, result, { warning, error }));
  yield call(callback, result, { warning, error, cancelled: false });
}

function* loadEngineCategoriesSaga(widgetId, mediaId, callback = noop) {
  // TODO(oiaroshchuk): query GraphQL for EngineCategories dta structure when one is ready. For now fake it as task statuses.
  const getTasksAndStatusesQuery = `query temporalDataObject($mediaId: ID!){
      temporalDataObject(id: $mediaId) {
        jobs {
          records {
            tasks {
              records {
                id 
                status
                completedDateTime
                engine {
                  id 
                  name
                  categoryId
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

  // array of categories that MDP does not support
  const unsupportedCategories = ['conductor', 'reducer', 'thumbnail', 'transcode'];

  const config = yield select(configModule.getConfig);
  const { apiRoot, graphQLEndpoint } = config;
  const graphQLUrl = `${apiRoot}/${graphQLEndpoint}`;
  const token = yield select(authModule.selectSessionToken);

  let response;
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: getTasksAndStatusesQuery,
      variables: { mediaId },
      token
    });
  } catch (error) {
    return yield* finishLoadEngineCategories(widgetId, null, { error }, callback);
  }

  if (!response || !response.data || !response.data.temporalDataObject) {
    console.warn('TemporalDataObject not found');
  }

  if (response.errors && response.errors.length) {
    const isMissingEngineCategoryError = function (error) {
      return error.name === 'not_found' && error.data && error.data.objectType === 'EngineCategory';
    };
    response.errors
      .filter(error => !isMissingEngineCategoryError(error))
      .forEach(error => console.warn(error));
  }

  let result = [];

  // START CONVERTING tasks to EngineCategories
  // {
  //  name
  //  id
  //  records [
  //  engines {
  //    name
  //    id
  //    status # aggregated status across tasks run for this engine on the asset chunk
  //    engineOutputs [
  //      {
  //        startTime # output segment start time
  //        endTime # output segment end time
  //        jsonData # actual engine output for a segment. For transcript engine output JSON data will contain {ttml: # for ttml transcript, vfl: transctip}
  //        status # NO_DATA, PENDING, FAILED, COMPLETED: segment status
  //      },
  //      ....
  //    ]
  //  }
  const tdo = response.data.temporalDataObject;
  if (tdo && tdo.jobs && tdo.jobs.records) {
    const engineCategoryById = new Map();
    // filter out unique engines per engine category
    tdo.jobs.records.forEach(job => {
      if (!job.tasks || !job.tasks.records) {
        return;
      }
      job.tasks.records
        .filter(task => task.engine && task.engine.category && task.engine.category.iconClass &&
            !unsupportedCategories.some(categoryType => categoryType === task.engine.category.categoryType))
        .forEach(task => {
          let engineCategory = engineCategoryById.get(task.engine.category.id);
          if (!engineCategory) {
            engineCategory = Object.assign({}, task.engine.category);
            engineCategory.iconClass = engineCategory.iconClass.replace('-engine', '');
            engineCategory.engines = [];
            engineCategoryById.set(engineCategory.id, engineCategory);
          }

          const engineFromTask = {};
          engineFromTask.id = task.engine.id;
          engineFromTask.name = task.engine.name;
          engineFromTask.status = task.status;
          engineFromTask.completedDateTime = Number(task.completedDateTime);
          // NOTE: empty engine outputs until GraphQL returns this
          engineFromTask.engineOutputs = (!task.engine.engineOutputs) ? [] : task.engine.engineOutputs;

          const filteredEngineIdx = engineCategory.engines.findIndex(filteredEngine => filteredEngine.id === engineFromTask.id);
          if (filteredEngineIdx == -1) {
            engineCategory.engines.push(engineFromTask);
          } else if (engineFromTask.completedDateTime > engineCategory.engines[filteredEngineIdx].completedDateTime) {
            // consider only the latest run engine, whatever it's status is, disregard previous runs
            engineCategory.engines[filteredEngineIdx] = engineFromTask;
          }
        });
    });

    // list all categories
    const allCategories = [];
    const categoriesIterator = engineCategoryById.values();
    let nextCategory = categoriesIterator.next();
    while (!nextCategory.done) {
      allCategories.push(nextCategory.value);
      nextCategory = categoriesIterator.next();
    }

    // set category status
    allCategories.forEach(category => {
      if (category.engines.some(engine => engine.status === 'failed')) {
        category.status = 'failed';
        return;
      }
      if (category.engines.some(engine => engine.status !== 'complete')) {
        category.status = 'inprogress';
      } else {
        category.status = 'completed';
      }
    });
    result = allCategories;
  }
  //// **************
  //// END CONVERSION

  yield* finishLoadEngineCategories(
    widgetId,
    result,
    {
      warning: false,
      error: false
    },
    callback
  );
}

function* loadTdoSaga(widgetId, mediaId, callback = noop) {
  const getMetadataQuery = `query temporalDataObject($mediaId: ID!){
      temporalDataObject(id: $mediaId) {
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
      query: getMetadataQuery,
      variables: { mediaId },
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

function* watchLoadEngineCategoriesRequest() {
  yield takeEvery(LOAD_ENGINE_CATEGORIES, function*(action) {
    const { mediaId, callback } = action.payload;
    const { widgetId } = action.meta;
    yield call(loadEngineCategoriesSaga, widgetId, mediaId, callback);
  });
}

function* watchLoadTdoRequest() {
  yield takeEvery(LOAD_TDO, function*(action) {
    const { mediaId, callback } = action.payload;
    const { widgetId } = action.meta;
    yield call(loadTdoSaga, widgetId, mediaId, callback);
  });
}

export default function* root() {
  yield all([fork(watchLoadEngineCategoriesRequest), fork(watchLoadTdoRequest)]);
}
