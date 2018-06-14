import { truncate } from 'lodash';

const getTranscriptLabel = modalState => {
  return {
    abbreviation: truncate(modalState.search, { length: 13 }),
    exclude: false,
    thumbnail: null
  };
};

export { getTranscriptLabel };
