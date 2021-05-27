const FaceConditionGenerator = modalState => {
  return {
    operator: 'term',
    field:
      'face-recognition.series.' +
      (modalState.type === 'entity' ? 'entityId' : 'libraryId'),
    value: modalState.id,
    not: modalState.exclude === true
  };
};

const FingerprintConditionGenerator = modalState => {
  return {
    operator: 'term',
    field:
      'fingerprint.series.' +
      (modalState.type === 'entity' ? 'entityId' : 'libraryId'),
    value: modalState.id,
    not: modalState.exclude === true
  };
};

const RecognizedTextConditionGenerator = modalState => {
  if (modalState && modalState.includeSpecialCharacters) {
    const query = V2QueryStringParser('text-recognition.series.ocrtext.native', modalState.search);
    query.highlight = "true";
    return query;
  } else {
    const query = V2QueryStringParser('text-recognition.series.ocrtext', modalState.search);
    query.highlight = "true";
    return query;
  }
};

const StructuredDataGenerator = modalState => {
  if (modalState.type === 'string') {
    if (modalState.operator === 'contains' || modalState.operator === 'not_contains') {
      return {
        operator: 'query_string',
        field: modalState.field + '.fulltext',
        value: `${modalState.value1.toLowerCase()}`,
        not: modalState.operator.indexOf('not') !== -1 ? true : undefined
      }
    } else {
      return {
        operator: 'term',
        field: modalState.field + '.string',
        value: `${modalState.value1}`,
        not: modalState.operator.indexOf('not') !== -1 ? true : undefined
      }
    }
  } else if (modalState.type === 'dateTime' || modalState.type === 'integer' || modalState.type === 'number') {
    if (modalState.operator === 'is' || modalState.operator === 'is_not') {
      return {
        operator: 'query_string',
        field: modalState.field,
        value: modalState.value1,
        not: modalState.operator.indexOf('not') !== -1 ? true : undefined
      }
    } else if (modalState.operator === 'range') {
      return {
        operator: 'range',
        field: modalState.field,
        gte: modalState.value1,
        lte: modalState.value2
      }
    } else {
      return {
        operator: 'range',
        field: modalState.field,
        [modalState.operator]: modalState.value1
      }
    }
  } else if (modalState.type === 'geoPoint') {
    return {
      operator: 'geo_distance',
      field: modalState.field,
      latitude: modalState.value1.latitude,
      longitude: modalState.value1.longitude,
      distance: modalState.value1.distance,
      units: 'm'
    };
  } else if (modalState.type === 'boolean') {
    return {
      operator: 'term',
      field: modalState.field,
      value: modalState.value1
    }
  }
}

function isEmpty(obj) {
  if (!obj) return true;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

const getCoordinatesFromBounding = (boundingPoly) => {
  return boundingPoly.reduce((accumulator, currentItem, currentIndex) => {
    if (currentIndex % 2 === 1) {
      return accumulator;
    }
    return [...accumulator, [currentItem.x, currentItem.y]]
  }, []);
}

const BoundingBoxGenerator = (modalState) => {
  const boundingPoly = modalState.advancedOptions.boundingPoly || [];
  if (!boundingPoly.length) {
    return {};
  }
  return {
    operator: "bounding_box",
    field: "boundingBox",
    relation: "within", // within | intersects | disjoint
    coordinates: getCoordinatesFromBounding(boundingPoly)
  }
}

const ConfidenceRangeGenerator = (modalState) => {
  const range = modalState.advancedOptions.range || [];
  if (!range.length || (range[0] === 0 && range[1] === 100)) {
    return {};
  }
  return {
    operator: "range",
    field: "confidence",
    gte: range[0] / 100,
    lt: range[1] / 100
  }
}

const buildAndOperator = (conditions) => {
  return {
    operator: 'and',
    conditions: conditions
  };
}

const buildOrOperator = (conditions) => {
  return {
    operator: 'or',
    conditions: conditions
  };
}

const LogoConditionGenerator = modalState => {
  if (modalState.type === 'fullText') {
    if (isEmpty(modalState.advancedOptions)) {
      return {
        operator: 'query_string',
        field: 'logo-recognition.series.found.fulltext',
        value: `*${modalState.id}*`,
        not: modalState.exclude === true
      };
    }
    else {
      const params = {
        operator: 'query_string',
        field: 'found.fulltext',
        value: `*${modalState.id}*`,
        not: modalState.exclude === true
      };
      const conditions = [params, BoundingBoxGenerator(modalState), ConfidenceRangeGenerator(modalState)];
      return {
        operator: "query_object",
        field: "logo-recognition.series",
        query: buildAndOperator(conditions.filter(item => !isEmpty(item)))
      }
    }
  } else {
    if (isEmpty(modalState.advancedOptions)) {
      return {
        operator: 'term',
        field: 'logo-recognition.series.found',
        value: modalState.id,
        not: modalState.exclude === true
      }
    }
    else {
      const params = {
        operator: 'term',
        field: 'found',
        value: modalState.id,
        not: modalState.exclude === true
      };
      const conditions = [params, BoundingBoxGenerator(modalState), ConfidenceRangeGenerator(modalState)];
      return {
        operator: "query_object",
        field: "logo-recognition.series",
        query: buildAndOperator(conditions.filter(item => !isEmpty(item)))
      }
    }
  }
};

const ObjectConditionGenerator = modalState => {
  if (modalState.type === 'fullText') {
    if (isEmpty(modalState.advancedOptions)) {
      return {
        operator: 'query_string',
        field: 'object-recognition.series.found.fulltext',
        value: `*${modalState.id}*`,
        not: modalState.exclude === true
      };
    }
    else {
      const params = {
        operator: 'query_string',
        field: 'found.fulltext',
        value: `*${modalState.id}*`,
        not: modalState.exclude === true
      };
      const conditions = [params, BoundingBoxGenerator(modalState, false), ConfidenceRangeGenerator(modalState, false)];
      return {
        operator: "query_object",
        field: "object-recognition.series",
        query: buildAndOperator(conditions.filter(item => !isEmpty(item)))
      }
    }
  } else {
    if (isEmpty(modalState.advancedOptions)) {
      return {
        operator: 'term',
        field: 'object-recognition.series.found',
        value: modalState.id,
        not: modalState.exclude === true
      };
    }
    else {
      const params = {
        operator: 'term',
        field: 'found',
        value: modalState.id,
        not: modalState.exclude === true
      };
      const conditions = [params, BoundingBoxGenerator(modalState), ConfidenceRangeGenerator(modalState)];
      return {
        operator: "query_object",
        field: "object-recognition.series",
        query: buildAndOperator(conditions.filter(item => !isEmpty(item)))
      }
    }
  }
};

const SentimentConditionGenerator = modalState => {
  let positive = '0.5';
  let negative = '0.5';
  if (modalState.customizedSearch && modalState.customizedSearch.sentiment) {
    const sentiment = modalState.customizedSearch.sentiment;
    if (sentiment.positive) {
      positive = sentiment.positive;
    }
    if (sentiment.negative) {
      negative = sentiment.negative;
    }
  }

  const sentimentOperator = {
    operator: 'range',
    field: 'sentiment.sentiment.positiveValue'
  };
  if (modalState.search == 'positive') {
    sentimentOperator.gte = positive;
  } else {
    sentimentOperator.lt = negative;
  }
  return sentimentOperator;
};

const TagConditionGenerator = modalState => {
  return {
    operator: 'query_object',
    field: 'tags',
    not: modalState.exclude === true,
    query: {
      operator: 'term',
      field: 'tags.value',
      value: modalState.id,
      dotNotation: true
    }
  };
};

const TimeConditionGenerator = modalState => {
  const dayPartTimeToMinutes = function (hourMinuteTime) {
    if (
      !hourMinuteTime ||
      typeof hourMinuteTime !== 'string' ||
      hourMinuteTime.length != 5
    ) {
      return 0;
    }
    const hourMinute = hourMinuteTime.split(':');
    return parseInt(hourMinute[0]) * 60 + parseInt(hourMinute[1]);
  };

  const daysOfTheWeek = [
    { isoWeekday: 1, name: 'Mon' },
    { isoWeekday: 2, name: 'Tue' },
    { isoWeekday: 3, name: 'Wed' },
    { isoWeekday: 4, name: 'Thu' },
    { isoWeekday: 5, name: 'Fri' },
    { isoWeekday: 6, name: 'Sat' },
    { isoWeekday: 7, name: 'Sun' }
  ];
  const startMinutes = dayPartTimeToMinutes(modalState.search.dayPartStartTime);
  const endMinutes = dayPartTimeToMinutes(modalState.search.dayPartEndTime);
  const dayMinuteField = modalState.search.stationBroadcastTime
    ? 'dayMinuteLocal'
    : 'dayMinuteUTC';

  const conditions = [];

  if (startMinutes <= endMinutes) {
    conditions.push({
      operator: 'range',
      field: dayMinuteField,
      gte: startMinutes,
      lte: endMinutes
    });
  } else {
    conditions.push({
      operator: 'range',
      field: dayMinuteField,
      gte: startMinutes,
      lte: 24 * 60
    });
    conditions.push({
      operator: 'range',
      field: dayMinuteField,
      gte: 0,
      lte: endMinutes
    });
  }

  if (modalState.search.stationBroadcastTime) {
    const selectedIsoWeekdays = [];
    daysOfTheWeek.forEach(weekday => {
      if (modalState.search.selectedDays[weekday.isoWeekday - 1]) {
        selectedIsoWeekdays.push(String(weekday.isoWeekday % 7));
      }
    });
    conditions.push({
      operator: 'terms',
      field: 'weekDayLocal',
      values: selectedIsoWeekdays
    });
  }

  return {
    operator: 'and',
    conditions: conditions
  };
};


const V2QueryStringParser = (field, queryString) => {
  function buildQueryStringOperator(field, queryText, highlight, analyzer) {
    var op = {
      operator: 'query_string',
      field: field,
      value: queryText
    };
    if (highlight) {
      op.highlight = true;
    }
    if (analyzer) {
      op._analyzer = analyzer;
    }
    return op;
  }

  function buildSpanStringQuery(field, queryString) {
    // cleanup redundant whitespace
    var queryText = queryString.replace(/\s{2+}/g, ' ');
    var start, end, distance;
    var spanConditions = [];
    var proximityOperatorPos = queryText.indexOf(' w/', start),
      proximityOperatorEnd;

    while (
      proximityOperatorPos > 1 &&
      proximityOperatorPos < queryText.length - 5
      ) {
      // parse the span distance
      proximityOperatorEnd = queryText.indexOf(' ', proximityOperatorPos + 1);
      var val = queryText.charAt(proximityOperatorPos + 3);
      switch (val) {
        case 'p':
          distance = 75;
          break;
        case 's':
          distance = 30;
          break;
        default:
          distance = parseInt(
            queryText.substring(proximityOperatorPos + 3, proximityOperatorEnd)
          );
          break;
      }

      // parse the left span operand
      if (queryText.charAt(proximityOperatorPos - 1) === '"') {
        //phrase
        start = queryText.lastIndexOf('"', proximityOperatorPos - 2);
      } else {
        //single word
        start = queryText.lastIndexOf(' ', proximityOperatorPos - 2);
        if (start < 0) {
          start = 0;
        } else {
          start++;
        }
      }

      // parse the right span operand
      if (queryText.charAt(proximityOperatorEnd + 1) === '"') {
        //phrase
        end = queryText.indexOf('"', proximityOperatorEnd + 2) + 1;
      } else {
        //single word
        end = queryText.indexOf(' ', proximityOperatorEnd + 2);
        if (end < 0) {
          end = queryText.length;
        }
      }

      spanConditions.push({
        operator: 'word_proximity',
        field: field,
        inOrder: false,
        distance: distance,
        values: [
          queryText.substring(start, proximityOperatorPos),
          queryText.substring(proximityOperatorEnd + 1, end)
        ]
      });

      // find the next span operand
      proximityOperatorPos = queryText.indexOf(' w/', proximityOperatorPos + 1);
    }
    return spanConditions;
  }

  function buildStringQueryAnd(
    field,
    queryExpression,
    highlight,
    keepCasing,
    analyzer
  ) {
    if (!field || !queryExpression) {
      return null;
    }
    // wrap simple queries in quotes
    if (queryExpression.indexOf(' ') < 0) {
      return buildQueryStringOperator(
        field,
        keepCasing ? queryExpression : queryExpression.toLowerCase(),
        highlight,
        analyzer
      );
    }

    // deffer to query_string to handle the negation
    var queryText = queryExpression.toLowerCase().replace('_not_', 'NOT');

    // if it is a simple query, i.e. no within
    if (queryExpression.indexOf(' w/') < 0) {
      return buildQueryStringOperator(field, queryText, highlight, analyzer);
    }

    // build 2 queries - all words query and just and AND-query of all spanning expressions
    // all words query
    var textSearchQuery = buildQueryStringOperator(
      field,
      queryText.replace(/\s+w\/(\d+|[ps])\s+/g, ' ')
    );
    // spanning expressions
    var spanQueries = buildSpanStringQuery(field, queryText);

    // add to the same AND expression as the span expressions
    spanQueries.push(textSearchQuery);

    return buildAndOperator(spanQueries);
  }

  function buildStringQuery(
    field,
    queryExpression,
    highlight,
    keepCasing,
    analyzer
  ) {
    if (queryExpression.indexOf(',') > 0) {
      var conditions = queryExpression
        .split(',')
        .map(function processOrExpression(subExpression) {
          return buildStringQueryAnd(
            field,
            subExpression,
            highlight,
            keepCasing,
            analyzer
          );
        });
      return buildOrOperator(conditions.filter(x => x));
    }

    return buildStringQueryAnd(
      field,
      queryExpression,
      highlight,
      keepCasing,
      analyzer
    );
  }
  return buildStringQuery(field, queryString);
}

// most of this logic comes from https://github.com/veritone/core-search-server/blob/develop/model/util/legacy.search.js#L162
const TranscriptConditionGenerator = modalState => {
  return V2QueryStringParser('transcript.transcript', modalState.search);
};

// most of this logic comes from https://github.com/veritone/core-search-server/blob/develop/model/util/legacy.search.js#L162
const DocumentConditionGenerator = modalState => {
  return V2QueryStringParser('text-document.text', modalState.search);
};

const GeolocationGenerator = modalState => {
  return {
    operator: 'geo_distance',
    field: 'geolocation.series.location',
    latitude: modalState.latitude || 0,
    longitude: modalState.longitude || 0,
    distance: modalState.distance || 0,
    units: 'm'
  };
};

const engineCategoryMapping = {
  '67cd4dd0-2f75-445d-a6f0-2f297d6cd182': TranscriptConditionGenerator,
  'ba2a423e-99c9-4422-b3a5-0b188d8388ab': DocumentConditionGenerator,
  'f2554098-f14b-4d81-9be1-41d0f992a22f': SentimentConditionGenerator,
  '3b4ac603-9bfa-49d3-96b3-25ca3b502325': RecognizedTextConditionGenerator,
  '6faad6b7-0837-45f9-b161-2f6bf31b7a07': FaceConditionGenerator,
  '088a31be-9bd6-4628-a6f0-e4004e362ea0': ObjectConditionGenerator,
  '17d62b84-8b49-465b-a6be-fe3ea3bc8f05': FingerprintConditionGenerator,
  '5a511c83-2cbd-4f2d-927e-cd03803a8a9c': LogoConditionGenerator,
  'tag-search-id': TagConditionGenerator,
  'time-search-id': TimeConditionGenerator,
  '203ad7c2-3dbd-45f9-95a6-855f911563d0': GeolocationGenerator,
  'sdo-search-id': StructuredDataGenerator
};

const engineCategoryMetadataMapping = {
  'f2554098-f14b-4d81-9be1-41d0f992a22f': 'sentiment-veritone',
  '3b4ac603-9bfa-49d3-96b3-25ca3b502325': 'text-recognition',
  '6faad6b7-0837-45f9-b161-2f6bf31b7a07': 'face-recognition',
  '088a31be-9bd6-4628-a6f0-e4004e362ea0': 'object-recognition',
  '17d62b84-8b49-465b-a6be-fe3ea3bc8f05': 'fingerprint',
  '5a511c83-2cbd-4f2d-927e-cd03803a8a9c': 'logo-recognition',
  'tag-search-id': 'tags',
  '203ad7c2-3dbd-45f9-95a6-855f911563d0': 'geolocation',
}

const getJoinOperator = query => {
  const operators = Object.keys(query);
  return operators[0];
};

const convertJoinOperator = joinOperator => {
  return joinOperator.replace('(', '');
};

const cspToPartialQuery = csp => {
  if (csp && csp.engineCategoryId) {
    return generateQueryCondition(csp);
  } else {
    const joinOperator = getJoinOperator(csp);
    const conditions = csp[joinOperator];
    const newBooleanSubtree = {
      operator: convertJoinOperator(joinOperator),
      conditions: conditions.map(cspToPartialQuery).filter(Boolean)
    };
    return newBooleanSubtree;
  }
};

const generateQueryCondition = node => {
  if (node
    && node.engineCategoryId
    && typeof engineCategoryMapping[node.engineCategoryId] === 'function'
  ) {
    node.state.customizedSearch = node.customizedSearch;
    const newCondition = engineCategoryMapping[node.engineCategoryId](node.state);
    return newCondition;
  } else {
    return null;
  }
};

const dedupeArray = arr => {
  const map = {};
  arr.forEach(x => {
    map[x] = true;
  });
  return Object.keys(map);
};

const selectMetadataFromCsp = csp => {
  let metadataKeys = [];
  if (csp && csp.engineCategoryId) {
    const metadataKey = csp.engineCategoryId === 'sdo-search-id' ? csp.state.select : engineCategoryMetadataMapping[csp.engineCategoryId];
    if (metadataKey) {
      metadataKeys.push(metadataKey);
    }
  } else {
    const joinOperator = getJoinOperator(csp);
    const conditions = csp[joinOperator];
    conditions.forEach(condition => {
      const subMetadataKeys = selectMetadataFromCsp(condition);
      if (Array.isArray(subMetadataKeys)) {
        metadataKeys = metadataKeys.concat(subMetadataKeys);
      }
    });
  }
  return metadataKeys;
};

const buildQuerySelect = csp => {
  const metadataKeysFromCsp = selectMetadataFromCsp(csp);
  const metadataKeys = ['veritone-job', 'veritone-file', 'transcript'].concat(metadataKeysFromCsp);
  return dedupeArray(metadataKeys);
};

const searchQueryGenerator = csp => {
  const queryFromCsp = cspToPartialQuery(csp);
  const querySelect = buildQuerySelect(csp);
  const baseQuery = {
    query: {
      operator: 'and',
      conditions: queryFromCsp ? [queryFromCsp] : []
    },
    select: querySelect
  };
  return baseQuery;
};

module.exports = {
  CSPToV3Query: searchQueryGenerator,
  engineCategoryMapping: engineCategoryMapping
};
