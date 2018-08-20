import { truncate } from 'lodash';

const getLogoLabel = modalState => {
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
    exclude: modalState.exclude,
    thumbnail: modalState.image
  };
};

export { getLogoLabel };
