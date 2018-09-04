import { truncate } from 'lodash';

const getOCRLabel = modalState => {
  return {
    full: modalState.search,
    abbreviation: truncate(modalState.search, { length: 13 })
  };
};

export { getOCRLabel };
