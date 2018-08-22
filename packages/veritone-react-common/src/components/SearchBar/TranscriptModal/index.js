import { truncate } from 'lodash';

const getTranscriptLabel = modalState => {
  return {
    full: modalState.search,
    abbreviation: truncate(modalState.search, { length: 13 }),
    exclude: false
  };
};

export { getTranscriptLabel };
