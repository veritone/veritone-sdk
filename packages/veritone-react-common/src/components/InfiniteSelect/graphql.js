const fetchSchemas = function fetchSchemas({
  api,
  auth,
  name = '',
  offset = 0,
}) {
  return fetch(`${api}v3/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth}`,
    },
    body: JSON.stringify({
      query: `
          query {
            dataRegistries(nameMatch: contains, name: "${name}", offset: ${offset}, orderBy: name, orderDirection: asc) {
              records {
                id,
                name,
                organization {
                  name
                },
                schemas {
                  records {
                    majorVersion
                  }
                }
              },
              limit,
              offset,
              count
            }
          }
        `,
    }),
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    }
    return false;
  });
};

// old query
/*
  query {
    schemas(nameMatch: contains, name: "${name}", offset: ${offset}) {
      records {
        majorVersion,
        dataRegistry {
          id,
          name,
          organization {
            name
          }
        }
      },
      limit,
      offset,
      count
    }
  }
*/

const fetchProperties = function fetchProperties({
  api,
  auth,
  name = '',
  dataRegistryId,
  majorVersion,
  offset = 0,
}) {
  const dataRegistryFilter =
    dataRegistryId && majorVersion
      ? `, dataRegistryVersion: {
		id: "${dataRegistryId}",
		majorVersion: ${majorVersion}
	}`
      : '';

  return fetch(`${api}v3/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth}`,
    },
    body: JSON.stringify({
      query: `
          query {
            schemaProperties(search: "${name}", offset: ${offset} ${dataRegistryFilter}) {
              records {
                type,
                path,
                searchPath,
                title,
                schema {
                  id,
                  dataRegistry {
                    name,
                    organization {
                      name
                    }
                  },
                  majorVersion
                }
              },
              limit,
              offset,
              count
            }
          }
        `,
    }),
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    }
    return false;
  });
};

const getAttribute = function getAttribute({ api, auth, schemaId }) {
  return fetch(`${api}v3/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth}`,
    },
    body: JSON.stringify({
      query: `
          query getSchema {
            schema(id: "${schemaId}") {
              dataRegistry {
                name,
                organization {
                  name
                },
                id,
                publishedSchema {
                  majorVersion,
                  minorVersion
                }
                schemas {
                  records {
                    id,
                    majorVersion,
                    minorVersion
                  }
                }
              }
            }
          }
        `,
    }),
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    }
    return false;
  });
};

export { fetchSchemas, fetchProperties, getAttribute };
