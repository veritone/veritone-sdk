import { isArray } from 'lodash';
import 'whatwg-fetch';

export default function attachAutocomplete(url, config) {
  return function(target) {
    let autcompleteFunctions = [];

    const fetchAutocomplete = (sectionHeader, queryPayload, searchType) => {
      return (queryString, token, baseAPIUri, libraries) => {
        queryPayload.text = queryString;
        if (isArray(libraries) && !queryPayload.index) {
          queryPayload.index = libraries.map((library) => 'library:' + library);
        }
        return fetch(baseAPIUri + url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          credentials: 'include',
          body: JSON.stringify(queryPayload)
        }).then(response => response.json()).then(response => {
          let resultNamespace = Object.keys(response.fields)[0];  // autocomplete response always provides at least one property
          let results = response.fields[resultNamespace] || [];
          let items = results.map(result => {
            let normalizedResult = {
              id: result.key,
              type: searchType,
              label: result.key
            };
            if (result.doc) {
              if (searchType === 'library') {
                normalizedResult.id = result.doc.libraryId;
                normalizedResult.image = result.doc.libraryCoverImageUrl;
                if(result.doc_count === 1) {
                  normalizedResult.description = `${result.doc_count} Item`;
                } else if (result.doc_count > 1) {
                  normalizedResult.description = `${result.doc_count} Items`;
                }
              } else if (searchType === 'entity') {
                normalizedResult.id = result.doc.entityId;
                normalizedResult.image = result.doc.profileImageUrl;
                normalizedResult.description = result.doc.libraryName;
              }
            }
            return normalizedResult;
          });
          return {
            header: sectionHeader,
            items: items
          };
        });
      }
    };

    const generateFetch = (sectionHeader, searchType) => {
      let payload = {
        limit: 10,
        index: config.index   // TODO: get library indices
      };
      if (searchType === 'library') {
        payload.fields = ['libraryName'];
        payload.query = {
          operator: 'and',
          conditions: [
            {
              operator: 'term',
              field: 'identifierType',
              value: config.identifierType
            }
          ]
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
              value: config.identifierType
            }
          ]
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
      autcompleteFunctions.push( queryString =>
        new Promise((resolve, reject) => {
          resolve({
            header: 'Full-text Search',
            items: [{
              id: queryString,
              type: 'fullText',
              label: queryString
            }]
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
    let defaultProps = { ...target.defaultProps };
    defaultProps.fetchAutocomplete = (queryString, token, api, libraries) => Promise.all(autcompleteFunctions.map(func => func(queryString, token, api, libraries)));
    target.defaultProps = defaultProps;
    return target;
  };
}
