import {
  fork,
  all,
  call,
  put,
  takeEvery,
  select
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { isArray, noop } from 'lodash';

import { modules } from 'veritone-redux-common';
const { auth: authModule, config: configModule } = modules;

import callGraphQLApi from '../../../shared/callGraphQLApi';
import { LOAD_ENGINE_CATEGORIES, loadEngineCategoriesComplete } from '.';

function* finishLoad(widgetId, result, { warning, error }, callback) {
  console.log('finish load before load complete');
  yield put(loadEngineCategoriesComplete(widgetId, result, { warning, error }));
  console.log('finish load after load complete');
  yield call(delay, warning || error ? 1500 : 500);
  yield call(callback, result, { warning, error, cancelled: false });
}

function* loadEngineCategoriesSaga(widgetId, mediaId, callback = noop) {
  const getMediaEngineCategoriesQuery = `query temporalDataObject($mediaId: ID!){
      temporalDataObject(id: $mediaId) {
        jobs {
          records {
            status 
            tasks {
              records {
                id 
                status
                engine {
                  id 
                  name
                  categoryId
                  category {
                    id
                    name
                  }
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

  let response;
  try {
    response = yield call(callGraphQLApi, {
      endpoint: graphQLUrl,
      query: getMediaEngineCategoriesQuery,
      variables: { mediaId },
      token
    });
  } catch (error) {
    return yield* finishLoad(widgetId, null, { error }, callback);
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

  // grab tasks with engine categories
  const tasksWithCategories = response.data.temporalDataObject.jobs.records[0].tasks.records.filter(task => task.engine && task.engine.category);

  console.log(tasksWithCategories);

  let result = tasksWithCategories;

  yield* finishLoad(
    widgetId,
    result,
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

export default function* root() {
  yield all([fork(watchLoadEngineCategoriesRequest)]);
}
