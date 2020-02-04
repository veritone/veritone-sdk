// The purpose of this helper is to provide functions to easily translate/construct V3 query conditions
const _ = require('lodash');

function buildTermOperator(field, value) {
  return {
    operator: 'term',
    field,
    value,
  };
}

function buildAndOperator(conditions) {
  return {
    operator: 'and',
    conditions,
  };
}

function buildOrOperator(conditions) {
  return {
    operator: 'or',
    conditions,
  };
}

function buildTranslatedQuery(language, q) {
  if (typeof language !== 'string' || typeof q !== 'string') {
    return [];
  }
  return buildAndOperator([
    {
      field: 'transcript.transcript',
      operator: 'query_string',
      value: q,
    },
    {
      field: 'transcript.language',
      operator: 'term',
      value: language,
    },
  ]);
}

function buildSimilarQuery(field, similarContext, query) {
  return {
    operator: 'match_similar',
    field,
    context: `${similarContext} ${query}`,
    minTermLength: 5,
    minTermMatch: 0.5,
  };
}

function buildQueryStringOperator(field, queryText, highlight, analyzer) {
  const op = {
    operator: 'query_string',
    field,
    value: queryText,
  };
  if (highlight) {
    op.highlight = true;
  }
  if (analyzer) {
    // eslint-disable-next-line no-underscore-dangle
    op._analyzer = analyzer;
  }
  return op;
}

function buildSpanStringQuery(field, queryString) {
  // cleanup redundant whitespace
  const queryText = queryString.replace(/\s{2+}/g, ' ');
  let start;
  let end;
  let distance;
  const spanConditions = [];
  let proximityOperatorPos = queryText.indexOf(' w/', start);
  let proximityOperatorEnd;

  while (
    proximityOperatorPos > 1 &&
    proximityOperatorPos < queryText.length - 5
  ) {
    // parse the span distance
    proximityOperatorEnd = queryText.indexOf(' ', proximityOperatorPos + 1);
    const val = queryText.charAt(proximityOperatorPos + 3);
    switch (val) {
      case 'p':
        distance = 75;
        break;
      case 's':
        distance = 30;
        break;
      default:
        distance = parseInt(
          queryText.substring(proximityOperatorPos + 3, proximityOperatorEnd),
          10
        );
        break;
    }

    // parse the left span operand
    if (queryText.charAt(proximityOperatorPos - 1) === '"') {
      // phrase
      start = queryText.lastIndexOf('"', proximityOperatorPos - 2);
    } else {
      // single word
      start = queryText.lastIndexOf(' ', proximityOperatorPos - 2);
      if (start < 0) {
        start = 0;
      } else {
        start += 1;
      }
    }

    // parse the right span operand
    if (queryText.charAt(proximityOperatorEnd + 1) === '"') {
      // phrase
      end = queryText.indexOf('"', proximityOperatorEnd + 2) + 1;
    } else {
      // single word
      end = queryText.indexOf(' ', proximityOperatorEnd + 2);
      if (end < 0) {
        end = queryText.length;
      }
    }

    spanConditions.push({
      operator: 'word_proximity',
      field,
      inOrder: false,
      distance,
      values: [
        queryText.substring(start, proximityOperatorPos),
        queryText.substring(proximityOperatorEnd + 1, end),
      ],
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
  const queryText = queryExpression.toLowerCase().replace('_not_', 'NOT');

  // if it is a simple query, i.e. no within
  if (queryExpression.indexOf(' w/') < 0) {
    return buildQueryStringOperator(field, queryText, highlight, analyzer);
  }

  // build 2 queries - all words query and just and AND-query of all spanning expressions
  // all words query
  const textSearchQuery = buildQueryStringOperator(
    field,
    queryText.replace(/\s+w\/(\d+|[ps])\s+/g, ' ')
  );
  // spanning expressions
  const spanQueries = buildSpanStringQuery(field, queryText);

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
    const conditions = queryExpression
      .split(',')
      .map(subExpression =>
        buildStringQueryAnd(
          field,
          subExpression,
          highlight,
          keepCasing,
          analyzer
        )
      );
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

// Private functions
function addQueryStringFilters(queryParams) {
  if (!queryParams.q) {
    return [];
  }

  const fields = queryParams.fullTextFields
    ? queryParams.fullTextFields.split(',')
    : ['transcript'];
  const filters = [];
  fields.forEach(field => {
    if (field === 'transcript') {
      // langugage query`
      if (
        queryParams.language &&
        queryParams.language.length &&
        queryParams.language.toLowerCase().indexOf('en') !== 0
      ) {
        filters.push(buildTranslatedQuery(queryParams.language, queryParams.q));
      } else if (queryParams.qlike) {
        filters.push(
          buildSimilarQuery(
            'transcript.transcript',
            queryParams.qlike,
            queryParams.q
          )
        );
      } else {
        filters.push(buildStringQuery('transcript.transcript', queryParams.q));
      }
    } else {
      filters.push(buildStringQuery(field, queryParams.q));
    }
  });
  return filters;
}

function buildTermsOperator(field, values) {
  const cleanedValues = values.map(val => {
    if (val.indexOf('"') === 0) {
      return val.substring(1, val.length - 1);
    }
    return val;
  });
  return {
    operator: 'terms',
    field,
    values: cleanedValues,
  };
}

function overrideSentimentQuery(queryParam, queryParams) {
  if (queryParam === 'sentiment-veritone.series.score') {
    let val = queryParams[queryParam];
    if (val === '0' || val === 0) {
      val = 'min:0.5';
    } else if (val === '1' || val === 1) {
      val = '0.5:max';
    }
    // eslint-disable-next-line no-param-reassign
    queryParams[queryParam] = val;
  }
}

function buildGeoDistanceOperator(queryParams) {
  if (
    !queryParams ||
    typeof queryParams.longitude === 'undefined' ||
    typeof queryParams.latitude === 'undefined' ||
    typeof queryParams.distance === 'undefined'
  ) {
    return [];
  }
  // eslint-disable-next-line no-unused-vars
  const distance = /([\d.]+)([a-zA-Z]*)/.exec(queryParams.distance) || [];
  return [
    {
      operator: 'geo_distance',
      field: 'geolocation.series',
      latitude: parseFloat(queryParams.latitude) || 0,
      longitude: parseFloat(queryParams.longitude) || 0,
      distance: parseFloat(queryParams.distance) || 0,
      units: queryParams.unit || 'mi',
    },
  ];
}

function buildRangeQuery(field, queryExpression) {
  if (queryExpression.indexOf(':') > 0) {
    const parts = queryExpression.split(':');

    if (parts.length === 4 && parts[0] === 'distance') {
      return buildGeoDistanceOperator(field, parts);
    }

    const rangeOperator = {
      operator: 'range',
      field,
    };

    let validNumberExpression = true;
    if (parts[0] && parts[0].toLowerCase() !== 'min') {
      // eslint-disable-next-line prefer-destructuring
      rangeOperator.gte = parts[0];
      validNumberExpression = !Number.isNaN(parts[0]);
    }
    if (validNumberExpression && parts[1] && parts[1].toLowerCase() !== 'max') {
      // eslint-disable-next-line prefer-destructuring
      rangeOperator.lt = parts[1];
      validNumberExpression = !Number.isNaN(parts[1]);
    }
    if (parts.length === 2 && validNumberExpression) {
      return rangeOperator;
    }
  }
  return null;
}

function buildMetadataQuery(field, valueExpression, fullTextFields) {
  if (_.endsWith(field, '.fulltext')) {
    fullTextFields.push(field.substring(0, field.indexOf('.')));
    return buildOrOperator([
      buildStringQuery(
        field.substring(0, field.lastIndexOf('.fulltext')),
        valueExpression,
        false,
        false,
        'none'
      ),
      buildStringQuery(field, valueExpression, false, false, 'none'),
    ]);
  }

  // field=[a:b,c:d] - build multi-range query
  if (
    _.startsWith(valueExpression, '[') &&
    _.endsWith(valueExpression, ']') &&
    valueExpression.indexOf(':') > 0
  ) {
    const parts = valueExpression
      .substring(1, valueExpression.length - 1)
      .split(',');
    const conditions = [];
    parts.forEach(r => {
      const range = buildRangeQuery(field, r);
      if (range) {
        conditions.push(range);
      }
    });
    if (conditions.length) {
      return buildOrOperator(conditions);
    }
  }

  // field=x,y,z - build terms query
  if (valueExpression.indexOf(',') > 0) {
    return buildTermsOperator(field, valueExpression.split(','));
  }

  // field = x;;y;;z - build AND query on the time-slice level
  if (valueExpression.indexOf(';;') > 0) {
    const andOperator = buildAndOperator(
      valueExpression.split(';;').map(val => {
        // strip quotation - old api ignores them and a lot of clients still send them
        if (val.indexOf('"') === 0) {
          return buildTermOperator(field, val.substring(1, val.length - 1));
        }
        return buildTermOperator(field, val);
      })
    );
    andOperator.strictMode = 'disable';
    return andOperator;
  }

  // field=x;y;z - build AND query
  if (valueExpression.indexOf(';') > 0) {
    return valueExpression.split(';').map(val => {
      // strip quotation - old api ignores them and a lot of clients still send them
      if (val.indexOf('"') === 0) {
        return buildTermOperator(field, val.substring(1, val.length - 1));
      }
      return buildTermOperator(field, val);
    });
  }

  // field=N:N - build range query
  if (valueExpression.indexOf(':') > 0) {
    const rangeOperator = buildRangeQuery(field, valueExpression);
    if (rangeOperator) {
      return rangeOperator;
    }
  }

  // field=* - build exists query
  if (valueExpression === '*') {
    return {
      operator: 'exists',
      name: field,
    };
  }

  // if the expression contains wildcard - build a query_string for the value
  if (valueExpression.indexOf('*') >= 0 && valueExpression.indexOf('"') !== 0) {
    return buildQueryStringOperator(field, valueExpression);
  }

  // strip quotation - old api ignores them and a lot of clients still send them
  if (valueExpression.indexOf('"') === 0) {
    return buildTermOperator(
      field,
      valueExpression.substring(1, valueExpression.length - 1)
    );
  }

  // else build exact match query
  return buildTermOperator(field, valueExpression);
}

function addMetadataFilters(request, queryParams) {
  // collapse same field queries so we can build correct query_object operator
  const qParams = {};
  const filters = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const queryParam in queryParams) {
    // eslint-disable-next-line no-prototype-builtins
    if (queryParams.hasOwnProperty(queryParam) && queryParam.indexOf('.') > 0) {
      overrideSentimentQuery(queryParam, queryParams);
      let typeKey = queryParam;
      const sIndex = queryParam.indexOf('.series');
      if (sIndex > 0) {
        typeKey = queryParam.substr(0, sIndex + '.series'.length);
      }
      if (!qParams[typeKey]) {
        qParams[typeKey] = [];
      }
      qParams[typeKey].push({
        param: queryParam,
        expression: queryParams[queryParam],
      });
    }
  }

  const fullTextFields = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const fieldKey in qParams) {
    // eslint-disable-next-line no-prototype-builtins
    if (qParams.hasOwnProperty(fieldKey)) {
      const qOperator = qParams[fieldKey];
      if (qOperator.length === 1) {
        filters.push(
          buildMetadataQuery(
            qOperator[0].param,
            qOperator[0].expression,
            fullTextFields
          )
        );
      } else {
        for (let i = 0, len = qOperator.length; i < len; i += 1) {
          filters.push(
            buildMetadataQuery(
              qOperator[i].param.substr(fieldKey.length + 1),
              qOperator[i].expression,
              fullTextFields
            )
          );
        }
      }
    }
  }

  // Commented this out because of scope creep;
  // The translators are only supposed to generate the conditions and
  // doesn't have access to the root request object....
  // TODO: figure out how to remedy this
  // if (fullTextFields.length) {
  // 	request._fulltext = fullTextFields;
  // }
  return filters;
}

function markDotField(query) {
  // eslint-disable-next-line no-param-reassign
  query.dotNotation = true;
  return query;
}

function buildTagQuery(queryExpression) {
  const parts = queryExpression.split(':');
  let tagQuery;
  if (parts.length > 1) {
    tagQuery = buildAndOperator([
      markDotField(buildTermOperator('tags.key', parts[0])),
      markDotField(buildTermOperator('tags.value', parts.slice(1).join(':'))),
    ]);
  } else {
    tagQuery = markDotField(buildTermOperator('tags.value', queryExpression));
  }

  return {
    operator: 'query_object',
    field: 'tags',
    query: tagQuery,
  };
}

// TODO: For all exported functions, we need to ensure the parameter passed into
// 	each respective function is correct.
export function generateTranscriptionConditions(queryParams) {
  return addQueryStringFilters(queryParams);
}

export function generateSentimentConditions(queryParams) {
  return addMetadataFilters(queryParams);
}

export function generateAudioCondition(queryParams) {
  return addMetadataFilters(queryParams);
}

export function generateFaceCondition(queryParams) {
  return addMetadataFilters(queryParams);
}

export function generateObjectCondition(queryParams) {
  return addMetadataFilters(queryParams);
}

export function generateGeolocationCondition(queryParams) {
  return buildGeoDistanceOperator(queryParams);
}

export function generateStationPayoutCondition() {
  // TODO
}

export function generateOcrCondition(queryParams) {
  return addMetadataFilters(queryParams);
}

export function generateLogoCondition(queryParams) {
  return addMetadataFilters(queryParams);
}

export function generateTagCondition(queryParams) {
  return buildTagQuery(queryParams);
}

export function generateTimeCondition() {
  // TODO
}
