const getFingerPrintLabel = modalState => {
  return {
    abbreviation: modalState && modalState.label && modalState.label.length > 10 ? modalState.label.substring(0, 10) + '...' : modalState.label,
    exclude: modalState.exclude,
    thumbnail: modalState.image
  };
};

export { getFingerPrintLabel }
