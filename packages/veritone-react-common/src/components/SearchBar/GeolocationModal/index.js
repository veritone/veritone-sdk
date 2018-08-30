const getGeolocationLabel = modalState => {
  const roundLocation = num => (num ? Math.round(num * 100) / 100 : '?');

  return {
    full: `${roundLocation(modalState.latitude)} : ${roundLocation(
      modalState.longitude
    )}`,
    abbreviation: `${roundLocation(modalState.latitude)} : ${roundLocation(
      modalState.longitude
    )}`,
    thumbnail: null
  };
};

export { getGeolocationLabel };
