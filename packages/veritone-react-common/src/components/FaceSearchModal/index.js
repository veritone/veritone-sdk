import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { isArray } from 'lodash';
import SearchAutocompleteContainer from '../SearchAutocomplete';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';

import { bool, func, string, shape, arrayOf } from 'prop-types';
import update from 'immutability-helper';
import 'whatwg-fetch';


// Face Autocomplete config:
const faceConfig = {
  identifierType: 'face',
  searchLibrary: true,
  searchEntity: true,
  index: ['library:0bf6711e-2773-40d6-bb35-053da384aec7','library:b64ef50a-0a5b-47ff-a403-a9a30f9241a4','library:ca9ddb3f-086f-4756-a34e-d36f1659b398','library:8c826910-47aa-41a3-8cde-68da8b6abc57','library:2426dbe5-eef3-4167-9da8-fb1eeec61c67','library:78a15b54-9230-4e5f-aff3-02de913ebdc5','library:e427a863-b437-49dd-8872-07379f887def','library:898be9b9-9965-44de-9611-27ba1e76124b','library:13e6f4a3-0d5c-4e11-9a30-913e981cb9ad','library:f628256c-4eea-4492-8a1b-05c25427cc0c','library:707b6f83-fd40-48ec-be98-73dccfe7642e','library:f0619e4d-f122-4353-971a-66fb0366fa2b','library:53c896da-173e-49f1-b7a5-bc94d7cb82af','library:ea5a281f-f2f6-4f47-ba06-dc2e3813f46a','library:4b6e8137-6a62-4161-b168-fe201826d9d0','library:1cce3a0e-c121-423c-bdd5-457671f5e6b8','library:cd36e043-4716-42ca-816b-9368f6f1092d','library:e8fb3880-0973-4858-8d3b-21c7765a7be7','library:bff525e2-99cf-4eb7-97bc-8b939a3e3ccc','library:4e84a3bd-6065-4b25-be85-6027dcd7fa31','library:4ad030d9-3b45-4482-9a0f-1739dccdb208','library:ab03d4d1-59f1-4442-be1d-220bc590b9b7','library:fc40a439-e615-4848-891e-ca5c039343e9','library:d64af877-d2fb-44ba-ab75-c1fcac6addca','library:c42b46f2-dc66-4105-8395-f16495aeb1cc','library:b8172bcf-78f9-45f4-b876-534c9ba1de4f','library:a7d732f6-4eb6-4cdf-9257-37fea6c79c1a','library:2277175f-5a26-4199-bdbc-cff3311297b0','library:513c805f-2893-4f49-8814-b2548ef700d6'],  // TODO: Dynamically populate this
  // index: ['mine', 'global'],  // For object/logo/tags
  // customFields: ['object-recognition.series.found'],  // For object/logo/tags
  // enableFullTextSearch: true
}

function attachAutocomplete(url, config) {
  return function(target) {
    let autcompleteFunctions = [];

    const fetchAutocomplete = (sectionHeader, queryPayload, searchType) => {
      return (queryString) => {
        queryPayload.text = queryString;
        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer d1b49845-0cad-4cac-a34b-2d7a81cb791e'  // TODO: Get the current user session token somehow
          },
          body: JSON.stringify(queryPayload)
        }).then(response => response.json()).then(response => {
          let resultNamespace = Object.keys(response.fields)[0];  // autocomplete response always provides at least one property
          let results = response.fields[resultNamespace] || [];
          let items = results.map(result => {
            let normalizedResult = {
              id: result.key,
              type: searchType,
              label: result.key,
              description: result.key
            };
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
              label: 'Text: ' + queryString
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
    defaultProps.fetchAutocomplete = (queryString) => Promise.all(autcompleteFunctions.map(func => func(queryString)));
    target.defaultProps = defaultProps;
    return target;
  };
}

@attachAutocomplete('https://api.aws-dev.veritone.com/api/search/autocomplete', faceConfig)
export default class FaceSearchModal extends React.Component {
  static defaultProps = {
    modalState: { queryResults: [], queryString: '' },
    applyFilter: value => console.log('Search faces by entityId', value),
    cancel: () => console.log('You clicked cancel')
  };

  constructor(props, defaultProps) {
    super(props, defaultProps);
  }

  static propTypes = {
    open: bool,
    modalState: shape({
      error: bool,
      queryString: string,
      queryResults: arrayOf(
        shape({
          header: string,
          items: arrayOf(shape({
            id: string,
            type: string,
            image: string,
            label: string,
            description: string
          }))
        })
      )
    }),
    fetchAutocomplete: func,
    applyFilter: func,
    cancel: func
  };

  state = JSON.parse(JSON.stringify(this.props.modalState));

  onChange = debouncedQueryString => {
    if (debouncedQueryString) {
      return this.props.fetchAutocomplete(debouncedQueryString).then(response => {
        let newState = Object.assign({}, this.state, {
          queryString: debouncedQueryString,
          queryResults: response
        });
        this.setState(newState);
        return debouncedQueryString;
      }).catch(err => {
        this.setState({
          error: true,
          queryString: debouncedQueryString,
          queryResults: []
        });
        return debouncedQueryString;
      });
    } else {
      this.setState({
        queryString: '',
        queryResults: []
      });
      return new Promise((resolve, reject) => resolve(debouncedQueryString || ''));
    }
  };

  selectResult = result => {
    console.log('Selected ', result);
    if (result) {
      this.setState(Object.assign({}, this.state, { selectedResult: result }), () => {
        this.props.applyFilter(result);
        this.props.cancel();
      });
    }
  };
 
  applyFilterIfValue = () => {
    if (isArray(this.state.queryResults) && this.state.queryResults.length) {
      let firstSection = this.state.queryResults[0];
      if (isArray(firstSection.items) && firstSection.items.length) {
        let filterToApply = firstSection.items[0];
        this.props.applyFilter(filterToApply);
        this.props.cancel();
      }
    }
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onRequestClose={this.props.cancel}
        onEscapeKeyUp={this.props.cancel}
      >
        <FaceSearchForm
          cancel={ this.props.cancel }
          applyFilter={ this.applyFilterIfValue }
          onChange={ this.onChange }
          modalState={ this.state }
          selectResult={ this.selectResult }
        />
      </Dialog>
    );
  }
}

export const FaceSearchForm = ( { cancel, applyFilter, onChange, onKeyPress, modalState, selectResult } ) => {
  return (
  <div>
    <DialogTitle>Search by Face</DialogTitle>
    <DialogContent style={{ width: '500px', margin: 'none' }}>
      <SearchAutocompleteContainer 
        id="face_autocomplete_container"
        onChange={ onChange }
        onKeyPress={ onKeyPress }
        cancel={ cancel }
        applyFilter={ applyFilter }
        componentState={ modalState }
        selectResult={ selectResult }
      />
    </DialogContent>
  </div>
)}

const FaceConditionGenerator = modalState => {
  // TODO: implement translator
  return {};
};

const FaceDisplay = modalState => {
  return {
    abbreviation: modalState.label.substring(0, 10),
    thumbnail: modalState.image
  };
};

export {
  FaceSearchModal,
  FaceConditionGenerator,
  FaceDisplay
};
