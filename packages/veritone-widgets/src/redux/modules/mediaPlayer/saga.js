import { fork, call, all, takeEvery, put, select } from 'redux-saga/effects';

import * as Actions from './actionCreators';
import { modules, helpers } from 'veritone-redux-common';
const { callGraphQLApi } = helpers;
const { auth: authModule, config: configModule } = modules;

//--------Load Content Template Schemas--------
function* loadLivestreamData(sourceId) {
  //TODO: update to the correct query when it's ready
  const loadLivestreamQuery = `
  query ($sourceId: ID){
    temporalDataObjects(sourceId: $sourceId) {
      records {
        id
        mediaId
        streams {
          uri
          protocol
        }
        sourceData {
          source {
            sourceType {
              isLive
            }
          }
        }
      }
    }
  }`;

  //const queryVariables = { sourceId: sourceId };
  //const response = yield* callGraphQL(loadLivestreamQuery, queryVariables);

  console.log(sourceId);
  const response = {
    data: {
      sourceId: sourceId,
      streams: [
        {
          protocol: 'hls',
          uri:
            'http://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8'
        }
      ]
    }
  };
  let data;
  if (!response.error) {
    //TODO: extract live stream data here when we have actual api
    data = response.data;
  } else {
    data = response.data;
  }

  console.log('do complete', data);
  yield put(Actions.loadLivestreamDataComplete(data, response.error));
}

function* watchLivestreamDataRequest() {
  yield takeEvery(Actions.LOAD_LIVESTREAM_DATA, function*(action) {
    yield call(loadLivestreamData, action.payload);
  });
}

export default function* root() {
  yield all([fork(watchLivestreamDataRequest)]);
}
