import { truncate } from 'lodash';

const getFingerPrintLabel = modalState => {
  return {
    full: modalState.label,
    abbreviation: truncate(modalState.label, { length: 13 }),
    exclude: modalState.exclude,
    thumbnail: modalState.image
  };
};

export { getFingerPrintLabel };
