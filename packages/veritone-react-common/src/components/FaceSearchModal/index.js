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

function attachAutocomplete(url, config) {
  return function(target) {
    const fetchAutocomplete = (queryString) => {
      // TODO: Remove this fank hill promise code and integrate with autocomplete
      return new Promise((resolve, reject) => {
        resolve([{
          header: 'Libraries',
          items: [{
            id: 'some libraryId',
            type: 'library',
            label: 'Hank Hill',
            image: 'http://odditymall.com/includes/content/upload/hank-hill-tripping-balls-t-shirt-1020.jpg',
            description: 'I tell you whut'
          }] 
        }]);
      });

      // TODO: Figure out some way to generate the category config-driven autocomplete payload

      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
        // TODO: Massage the response data into the following format
        // response.data = [{
        //   header: 'Section Title',
        //   items: [{
        //     id: string,
        //     type: 'library/entity/fullText',
        //     label: string,
        //     image: string,
        //     description: string
        //   }]
        // }]
      });
    }
    target.defaultProps = { ...target.defaultProps, fetchAutocomplete: fetchAutocomplete };
    return target;
  };
}

@attachAutocomplete('https://api.aws-dev.veritone.com/api/search/autocomplete', {})
export default class FaceSearchModal extends React.Component {
  static defaultProps = {
    modalState: { queryResults: [], queryString: '' },
    applyFilter: value => console.log('Search faces by entityId', value),
    cancel: () => console.log('You clicked cancel')
  }

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

  state = Object.assign({}, this.props.modalState);

  onChange = debouncedQueryString => {
    if (debouncedQueryString) {
      this.props.fetchAutocomplete(debouncedQueryString).then(response => {
        let newState = Object.assign({}, this.state, {
          queryResults: response
        });
        this.setState(newState);
      }).catch(err => {
        this.setState({
          error: true,
          queryResults: []
        });
      });
    } else {
      this.setState({
        queryResults: []
      });
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
