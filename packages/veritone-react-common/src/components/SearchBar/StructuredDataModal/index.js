const getStructuredDataLabel = modalState => {
  const getAbbreviation = (modalState) => {
    if (modalState.operator === 'range') {
      return `${modalState.field.split('.').slice(-1)[0]} ${StructuredDataModal.OPERATOR_ABRV[modalState.operator]} (${modalState.value1},${modalState.value2})`
    } else if (modalState.operator === 'within') {
      return `${Number((modalState.value1.distance).toFixed(0))} meters of ${Number((modalState.value1.latitude).toFixed(2))}, ${Number((modalState.value1.longitude).toFixed(2))}`
    } else {
      return  `${modalState.field.split('.').slice(-1)[0]} ${StructuredDataModal.OPERATOR_ABRV[modalState.operator]} ${modalState.value1}`
    }
  }
  return {
    abbreviation: getAbbreviation(modalState),
    exclude: modalState.operator.indexOf('not') !== -1,
    thumbnail: null
  };
};

export { getStructuredDataLabel }
