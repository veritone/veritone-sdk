import React from 'react';

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
      "fields": ["schemaFields.name"],
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

export {
  fetchAutocomplete,
  fetchSDOSchema
}
