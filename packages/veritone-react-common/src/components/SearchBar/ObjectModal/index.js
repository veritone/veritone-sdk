const getObjectLabel = modalState => {
  return {
    abbreviation: modalState.label.substring(0, 10),
    thumbnail: modalState.image,
    exclude: modalState.exclude
  };
};

export { getObjectLabel }
