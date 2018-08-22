import { includes } from 'lodash';

const getStructuredDataLabel = modalState => {
  const OPERATOR_ABRV = {
    is: 'IS',
    is_not: 'IS NOT',
    gte: '>=',
    lte: '<=',
    gt: '>',
    lt: '<',
    contains: 'CONTAINS',
    not_contains: 'EXCLUDES',
    within: 'WITHIN',
    range: 'BETWEEN'
  };

  const getAbbreviation = modalState => {
    if (modalState.operator === 'range') {
      return `${modalState.field.split('.').slice(-1)[0]} ${
        OPERATOR_ABRV[modalState.operator]
      } (${modalState.value1},${modalState.value2})`;
    } else if (modalState.operator === 'within') {
      return `${Number(
        modalState.value1.distance.toFixed(0)
      )} meters of ${Number(modalState.value1.latitude.toFixed(2))}, ${Number(
        modalState.value1.longitude.toFixed(2)
      )}`;
    } else {
      return `${modalState.field.split('.').slice(-1)[0]} ${
        OPERATOR_ABRV[modalState.operator]
      } ${modalState.value1}`;
    }
  };
  return {
    full: getAbbreviation(modalState),
    abbreviation: getAbbreviation(modalState),
    exclude: includes(modalState.operator, 'not'),
    thumbnail: null
  };
};

export { getStructuredDataLabel };
