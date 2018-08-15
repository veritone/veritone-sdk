import { all, fork, takeEvery, put } from 'redux-saga/effects';
import {
  FETCH_ENGINE_RUNS_FAILURE,
  EXPORT_AND_DOWNLOAD_FAILURE,
  APPLY_SUBTITLE_CONFIGS,
  addSnackBar,
  storeSubtitleConfigs
} from './';
import { guid } from '../../../shared/util';

function* watchErrors() {
  yield takeEvery(
    [FETCH_ENGINE_RUNS_FAILURE, EXPORT_AND_DOWNLOAD_FAILURE],
    function* onError(action) {
      if (action.error) {
        let message;
        switch (action.type) {
          case FETCH_ENGINE_RUNS_FAILURE:
            message = 'Failed to get engine runs for one or more recordings.';
            break;
          case EXPORT_AND_DOWNLOAD_FAILURE:
            message = 'Failed to export.';
            break;
          default:
            message = action.payload.message;
            break;
        }
        yield put(
          addSnackBar({
            id: guid(),
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            },
            open: true,
            message: message,
            variant: 'error'
          })
        );
      }
    }
  );
}

function* watchApplySubtitleConfigs() {
  yield takeEvery(APPLY_SUBTITLE_CONFIGS, function* onApplySubtitleConfigs({
    payload: { categoryId, values }
  }) {
    yield put(storeSubtitleConfigs(categoryId, values));
  });
}

export default function* root() {
  yield all([fork(watchErrors), fork(watchApplySubtitleConfigs)]);
}
