const fetchSDOSchema = function fetchSDOSchema(api, auth, schemaId) {
  return fetch(`${api}v3/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + auth
    },
    body: JSON.stringify(
      {
        "query": `
          query {
            schema(id: "${schemaId}") {
              id,
              majorVersion,
              minorVersion,
              dataRegistry {
                name,
                organization {
                  name
                }
              }
            }
          }
        `
      })
  }).then(
    response => {
      if (response.status === 200) {
        return response.json();
      } else {
        return false;
      }
    }
  );
}

const fetchAutocomplete = function fetchAutocomplete(api, auth, value) {
  return fetch(`${api}v1/search/search/autocomplete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + auth
    },
    body: JSON.stringify(
      {
        "index": ["schema"],
        "fields": ['schemaFields.name'],
        "text": value,
        "returnContext": true
      })
  }).then(
    response => {
      if (response.status === 200) {
        return response.json();
      } else {
        return false;
      }
    }
  );
}

const fetchAutocompleteValues = function fetchAutocomplete(api, auth, value, field, sourceFilters = []) {
  const query = {
    "index": ["mine", "global"],
    "fields": [field],
    "text": value,
    "returnContext": true
  };

  if (sourceFilters && sourceFilters.length > 0) {
    query.query = {
      "operator": "or",
      "conditions": sourceFilters.map(source => (
        {
          "operator": "term",
          "field": "mediaSourceId",
          "value": source
        }
      ))
    }
  }

  return fetch(`${api}v1/search/search/autocomplete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + auth
    },
    body: JSON.stringify(query)
  }).then(
    response => {
      if (response.status === 200) {
        return response.json();
      } else {
        return false;
      }
    }
  );
}

export {
  fetchAutocomplete,
  fetchAutocompleteValues,
  fetchSDOSchema
}
