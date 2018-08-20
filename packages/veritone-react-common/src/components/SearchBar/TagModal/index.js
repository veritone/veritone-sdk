import { truncate } from 'lodash';

const getTagLabel = modalState => {
  return {
    full: modalState.label,
    abbreviation: truncate(modalState.label, { length: 13 }),
    exclude: modalState.exclude
  };
};

export { getTagLabel };
