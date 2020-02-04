/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import { isArray } from 'lodash';
import 'whatwg-fetch';

export default function attachAutocomplete(url, config) {
  return target => {
    const autcompleteFunctions = [];

    const fetchAutocomplete = (sectionHeader, queryPayload, searchType) => (
      queryString,
      token,
      baseAPIUri,
      libraries
    ) => {
      queryPayload.text = queryString;
      if (isArray(libraries) && !queryPayload.index) {
        queryPayload.index = libraries.map(library => `library:${library}`);
      }
      return fetch(baseAPIUri + url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(queryPayload),
      })
        .then(response => response.json())
        .then(response => {
          const resultNamespace = Object.keys(response.fields)[0]; // autocomplete response always provides at least one property
          const results = response.fields[resultNamespace] || [];
          let items = [];

          if (searchType === 'library') {
            items = results.map(result => {
              const normalizedResult = {
                id: result.key,
                type: searchType,
                label: result.key,
              };
              if (result.doc) {
                normalizedResult.id = result.doc.libraryId;
                normalizedResult.image = result.doc.libraryCoverImageUrl;
                if (result.doc_count === 1) {
                  normalizedResult.description = `${result.doc_count} Item`;
                } else if (result.doc_count > 1) {
                  normalizedResult.description = `${result.doc_count} Items`;
                }
              }
              return normalizedResult;
            });
          } else if (searchType === 'entity') {
            results.map(result => {
              if (result && result.docs) {
                result.docs.map(entity => {
                  items.push({
                    id: entity.entityId,
                    type: searchType,
                    label: entity.entityName,
                    image: entity.profileImageUrl,
                    description: entity.libraryName,
                  });
                });
              }
            });
          } else if (searchType === 'custom') {
            items = results.map(result => ({
              id: result.key,
              label: result.key,
            }));
          }

          return {
            header: sectionHeader,
            items,
          };
        });
    };

    const generateFetch = (sectionHeader, searchType) => {
      const payload = {
        limit: 10,
        index: config.index, // TODO: get library indices
      };
      if (searchType === 'library') {
        payload.fields = ['libraryName'];
        payload.query = {
          operator: 'and',
          conditions: [
            {
              operator: 'term',
              field: 'identifierType',
              value: config.identifierType,
            },
          ],
        };
        payload.returnContext = true;
      } else if (searchType === 'entity') {
        payload.fields = ['entityName'];
        payload.aggregateFields = ['libraryId'];
        payload.query = {
          operator: 'and',
          conditions: [
            {
              operator: 'term',
              field: 'identifierType',
              value: config.identifierType,
            },
          ],
        };
        payload.returnContext = true;
      } else if (searchType === 'custom') {
        payload.fields = config.customFields;
        payload.index = ['mine', 'global'];
        payload.returnContext = false;
      }
      return fetchAutocomplete(sectionHeader, payload, searchType);
    };

    if (config.enableFullTextSearch) {
      autcompleteFunctions.push(
        queryString =>
          new Promise(resolve => {
            resolve({
              header: 'Full-text Search',
              items: [
                {
                  id: queryString.toLowerCase(),
                  type: 'fullText',
                  label: queryString,
                },
              ],
            });
          })
      );
    }
    if (config.searchLibrary) {
      autcompleteFunctions.push(generateFetch('Libraries', 'library'));
    }
    if (config.searchEntity) {
      autcompleteFunctions.push(generateFetch('Entities', 'entity'));
    }
    if (isArray(config.customFields)) {
      autcompleteFunctions.push(generateFetch('Results', 'custom'));
    }
    const defaultProps = { ...target.defaultProps };
    defaultProps.fetchAutocomplete = (queryString, token, api, libraries) =>
      Promise.all(
        autcompleteFunctions.map(func =>
          func(queryString, token, api, libraries)
        )
      );
    target.defaultProps = defaultProps;
    return target;
  };
}
