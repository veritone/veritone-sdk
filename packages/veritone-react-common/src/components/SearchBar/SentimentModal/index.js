const getSentimentLabel = modalState => {
  return {
    full: modalState.search === 'positive' ? 'Positive' : 'Negative',
    abbreviation: modalState.search === 'positive' ? 'Positive' : 'Negative'
  };
};

export { getSentimentLabel };
