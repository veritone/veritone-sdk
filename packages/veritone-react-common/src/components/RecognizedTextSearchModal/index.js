import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';

import { bool, func, string, shape } from 'prop-types';

export default class RecognizedTextSearchModal extends React.Component {
  static propTypes = {
    open: bool,
    modalState: shape({ search: string }),
    applyFilter: func,
    cancel: func
  };
  static defaultProps = {
    applyFilter: value => console.log('Search text by value', value),
    cancel: () => console.log('You clicked cancel')
  };

  state = {
    filterValue: null || this.props.modalState.search
  };

  onChange = event => {
    this.setState({
      filterValue: event.target.value
    });
  };

  onEnter = event => {
    if (event.key === 'Enter') {
      this.applyFilterIfValue();
    }
  };

  applyFilterIfValue = () => {
    if(!this.state.filterValue || this.state.filterValue.trim().length === 0) {
      this.props.applyFilter();
    } else {
      this.props.applyFilter(
        { search: this.state.filterValue ? this.state.filterValue.trim() : null }
      );
    }
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onRequestClose={this.props.cancel}
        onEscapeKeyUp={this.props.cancel}
      >
        <RecognizedTextSearchForm
          cancel={ this.props.cancel }
          defaultValue={ this.props.modalState.search }
          onSubmit={ this.applyFilterIfValue }
          onChange={ this.onChange }
          onKeyPress={ this.onEnter }
          inputValue={ this.state.filterValue }
        />
      </Dialog>
    );
  }
}

export const RecognizedTextSearchForm = ( { defaultValue, cancel, onSubmit, onChange, onKeyPress, inputValue } ) => {
  return (
    <div>
      <DialogTitle>Search by Recognized Text</DialogTitle>
      <DialogContent style={{ width: '500px', margin: 'none' }}>
        <TextField
          id="text_search_field"
          autoFocus
          margin="none"
          defaultValue={ defaultValue }
          onChange={ onChange }
          onKeyPress={ onKeyPress }
          placeholder="Text to search"
          helperText="Searches within our database for recognized text."
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={ cancel } color="primary" className="textSearchCancel">
          Cancel
        </Button>
        <Button
          disabled={!inputValue && !defaultValue}
          onClick={ onSubmit }
          color="primary"
          className="textSearchSubmit"
          raised
        >
          Search
        </Button>
      </DialogActions>
    </div>
  )};

RecognizedTextSearchModal.defaultProps = {
  modalState: { search: '' }
};

const RecognizedTextConditionGenerator = modalState => {
  // orc exact text query
  return {
    operator: 'query_string',
    field: 'text-recognition.series.ocrtext',
    value: modalState.search.toLowerCase()
  };
};

const RecognizedTextDisplay = modalState => {
  return {
    abbreviation: modalState.search && modalState.search.length > 10 ? modalState.search.substring(0, 10) + '...' : modalState.search,
    thumbnail: null
  };
};

export {
  RecognizedTextSearchModal,
  RecognizedTextConditionGenerator,
  RecognizedTextDisplay
};
