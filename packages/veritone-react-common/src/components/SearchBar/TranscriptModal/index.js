const TranscriptDisplay = modalState => {
  return {
    abbreviation:
      modalState.search && modalState.search.length > 10
        ? modalState.search.substring(0, 10) + '...'
        : modalState.search,
    exclude: false,
    thumbnail: null
  };
};

export { TranscriptDisplay };
