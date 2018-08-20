export const namespace = 'veritoneMediaPlayer';

export const RESET_MEDIA_PLAYER = namespace + '::RESET_MEDIA_PLAYER';
export const LOAD_LIVESTREAM_DATA = namespace + '::LOAD_LIVESTREAM_DATA';
export const LOAD_LIVESTREAM_DATA_COMPLETE =
  namespace + '::LOAD_LIVESTREAM_DATA_COMPLETE';

export const resetMediaPlayer = () => ({
  type: RESET_MEDIA_PLAYER
});

export const loadLivestreamData = sourceId => ({
  type: LOAD_LIVESTREAM_DATA,
  payload: sourceId
});

export const loadLivestreamDataComplete = (result, error) => ({
  type: LOAD_LIVESTREAM_DATA_COMPLETE,
  payload: result,
  error: error
});
