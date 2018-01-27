import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
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
      ),
      selectedResults: arrayOf(shape({ 
        id: string,
        type: string,
        image: string,
        label: string,
        description: string
      }))
    }),
    fetchAutocompleteResults: func,
    applyFilter: func,
    cancel: func
  };

  state = Object.assign({}, this.props.modalState);

  onChange = event => {
    // // TODO: Make autocomplete http call
    let text = event.target.value;
    console.log('Make autocomplete http call', text);
    this.props.fetchAutocompleteResults(text).then(response => {
      this.setState(Object.assign({}, this.state, {
        queryResults: response
      }));
    }).catch(err => {
      console.log('Autocomplete error: ', err);
      this.setState(Object.assign({}, this.state, {
        error: true,
        queryResults: []
      }));
    })
  };

  onEnter = event => {
    if (event.key === 'Enter') {
      this.applyFilterIfValue();
    }
  };

  deselectPill = pill => {
    console.log('Deselected ', pill);
    if (pill) {
      let newState = {
        selectedResults: this.state.selectedResults.slice(0)
      };
      let removeIndex = newState.selectedResults.findIndex(result => {
        return result.id === pill.id;
      });
      if (removeIndex !== -1) {
        newState.selectedResults.splice(removeIndex, 1);
        this.setState(newState);
      }
    }
  };

  selectPill = pill => {
    console.log('Selected ', pill);
    let notSelected = this.state.selectedResults.findIndex(result => {
      return result.id === pill.id;
    }) === -1;
    if (pill && notSelected) {
      let newState = update(this.state, {
        queryString: { $set: '' },
        selectedResults: { $push: [pill] }
      });
      console.log(newState)
      this.setState(newState);
    }
  };
 
  applyFilterIfValue = () => {
    this.props.applyFilter({
      value: this.state.selectedResults
    });
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
          onKeyPress={ this.onEnter }
          modalState={ this.state }
          deselectPill={ this.deselectPill }
          selectPill={ this.selectPill }
        />
      </Dialog>
    );
  }
}

export const FaceSearchForm = ( { cancel, onSubmit, onChange, onKeyPress, modalState, deselectPill, selectPill } ) => {
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
        deselectPill={ deselectPill }
        selectPill={ selectPill }
      />
    </DialogContent>
  </div>
)}

FaceSearchModal.defaultProps = {
  modalState: { queryResults: [], selectedResults: [], queryString: '' },
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
