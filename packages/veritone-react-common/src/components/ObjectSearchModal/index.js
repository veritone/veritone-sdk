import React from 'react';
import { Button, TextField } from 'material-ui';
import SearchAutocompleteContainer from '../SearchAutocomplete';
import attachAutocomplete from '../SearchAutocomplete/helper.js';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';

import { bool, func, string, shape, arrayOf } from 'prop-types';
import update from 'immutability-helper';

// Object Autocomplete config:
const objectConfig = {
  identifierType: 'object',
  searchLibrary: false,
  searchEntity: false,
  // index: ['library:0bf6711e-2773-40d6-bb35-053da384aec7','library:b64ef50a-0a5b-47ff-a403-a9a30f9241a4','library:ca9ddb3f-086f-4756-a34e-d36f1659b398','library:8c826910-47aa-41a3-8cde-68da8b6abc57','library:2426dbe5-eef3-4167-9da8-fb1eeec61c67','library:78a15b54-9230-4e5f-aff3-02de913ebdc5','library:e427a863-b437-49dd-8872-07379f887def','library:898be9b9-9965-44de-9611-27ba1e76124b','library:13e6f4a3-0d5c-4e11-9a30-913e981cb9ad','library:f628256c-4eea-4492-8a1b-05c25427cc0c','library:707b6f83-fd40-48ec-be98-73dccfe7642e','library:f0619e4d-f122-4353-971a-66fb0366fa2b','library:53c896da-173e-49f1-b7a5-bc94d7cb82af','library:ea5a281f-f2f6-4f47-ba06-dc2e3813f46a','library:4b6e8137-6a62-4161-b168-fe201826d9d0','library:1cce3a0e-c121-423c-bdd5-457671f5e6b8','library:cd36e043-4716-42ca-816b-9368f6f1092d','library:e8fb3880-0973-4858-8d3b-21c7765a7be7','library:bff525e2-99cf-4eb7-97bc-8b939a3e3ccc','library:4e84a3bd-6065-4b25-be85-6027dcd7fa31','library:4ad030d9-3b45-4482-9a0f-1739dccdb208','library:ab03d4d1-59f1-4442-be1d-220bc590b9b7','library:fc40a439-e615-4848-891e-ca5c039343e9','library:d64af877-d2fb-44ba-ab75-c1fcac6addca','library:c42b46f2-dc66-4105-8395-f16495aeb1cc','library:b8172bcf-78f9-45f4-b876-534c9ba1de4f','library:a7d732f6-4eb6-4cdf-9257-37fea6c79c1a','library:2277175f-5a26-4199-bdbc-cff3311297b0','library:513c805f-2893-4f49-8814-b2548ef700d6'],  // TODO: Dynamically populate this
  index: ['mine', 'global'],  // For object/logo/tags
  customFields: ['object-recognition.series.found'],  // For object/logo/tags
  enableFullTextSearch: true
};

@attachAutocomplete('https://api.aws-dev.veritone.com/api/search/autocomplete', objectConfig)
export default class ObjectSearchModal extends React.Component {
  static defaultProps = {
    modalState: { queryResults: [], queryString: '' },
    applyFilter: value => console.log('Search objects by entityId', value),
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

  state = JSON.parse(JSON.stringify( Object.assign({}, this.props.modalState, { queryString: this.props.modalState.label || '' } )));

  onChange = debouncedQueryString => {
    if (debouncedQueryString) {
      return this.props.fetchAutocomplete(debouncedQueryString, this.props.auth).then(response => {
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
        onClose={this.props.cancel}
      >
        <ObjectSearchForm
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

export const ObjectSearchForm = ( { cancel, applyFilter, onChange, onKeyPress, modalState, selectResult } ) => {
  return (
  <div>
    <DialogTitle>Search by Object</DialogTitle>
    <DialogContent style={{ width: '500px', margin: 'none' }}>
      <SearchAutocompleteContainer
        id="object_autocomplete_container"
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

const ObjectConditionGenerator = modalState => {
  // TODO: implement translator
  return {};
};

const ObjectDisplay = modalState => {
  return {
    abbreviation: modalState.label.substring(0, 10),
    thumbnail: modalState.image
  };
};

export {
  ObjectSearchModal,
  ObjectConditionGenerator,
  ObjectDisplay
};
