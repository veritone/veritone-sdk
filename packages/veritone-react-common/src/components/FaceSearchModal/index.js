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

export default class FaceSearchModal extends React.Component {
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
    fetchAutocompleteResults: func,
    applyFilter: func,
    cancel: func
  };

  state = Object.assign({}, this.props.modalState);

  onChange = event => {
    let text = event.target.value;
    if (text) {
      this.props.fetchAutocompleteResults(text).then(response => {
        this.setState(Object.assign({}, this.state, {
          queryResults: response
        }));
      }).catch(err => {
        this.setState({
          error: true,
          queryResults: []
        });
      })
    } else {
      this.setState({
        queryResults: []
      });
    }
  };

  selectResult = result => {
    console.log('Selected ', result);
    if (result) {
      this.props.applyFilter(result);
      this.props.cancel();
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
          onSubmit={ this.applyFilterIfValue }
          onChange={ this.onChange }
          modalState={ this.state }
          selectResult={ this.selectResult }
        />
      </Dialog>
    );
  }
}

export const FaceSearchForm = ( { cancel, onSubmit, onChange, onKeyPress, modalState, selectResult } ) => {
  return (
  <div>
    <DialogTitle>Search by Face</DialogTitle>
    <DialogContent style={{ width: '500px', margin: 'none' }}>
      <SearchAutocompleteContainer 
        id="face_autocomplete_container"
        onChange={ onChange }
        onKeyPress={ onKeyPress }
        cancel={ cancel }
        applyFilter={ onSubmit }
        componentState={ modalState }
        selectResult={ selectResult }
      />
    </DialogContent>
  </div>
)}

FaceSearchModal.defaultProps = {
  modalState: { queryResults: [], queryString: '' },
  applyFilter: value => console.log('Search faces by entityId', value),
  cancel: () => console.log('You clicked cancel')
};

const FaceConditionGenerator = modalState => {
  // TODO: implement translator
  return {};
};

const FaceDisplay = modalState => {
  return {
    abbreviation: modalState.value.substring(0, 10),
    thumbnail: null
  };
};

export {
  FaceSearchModal,
  FaceConditionGenerator,
  FaceDisplay
};
