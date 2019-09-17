const getSentimentLabel = modalState => {
  return {
    abbreviation: modalState.search === 'positive' ? 'Positive' : 'Negative',
    exclude: false,
    thumbnail: null
  };
};

export { getSentimentLabel }
