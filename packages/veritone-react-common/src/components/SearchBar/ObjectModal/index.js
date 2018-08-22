import { truncate } from 'lodash';

const getObjectLabel = modalState => {
  const truncatedLabel = truncate(modalState.label, { length: 13 });
  return {
    full:
      modalState.type === 'fullText'
        ? `CONTAINS: ${modalState.label}`
        : modalState.label,
    abbreviation:
      modalState.type === 'fullText'
        ? `CONTAINS: ${truncatedLabel}`
        : truncatedLabel,
    thumbnail: modalState.image,
    exclude: modalState.exclude
  };
};

export { getObjectLabel };
