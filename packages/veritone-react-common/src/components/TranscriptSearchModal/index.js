import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';

import { bool, func, string, shape } from 'prop-types';

export default class TranscriptSearchModal extends React.Component {
  static propTypes = {
    open: bool,
    modalState: shape({ value: string }),
    applyFilter: func,
    cancel: func
  };
  static defaultProps = {
    applyFilter: value => console.log('Search transcript by value', value),
    cancel: () => console.log('You clicked cancel')
  };

  state = {
    filterValue: null || this.props.modalState.value
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
    this.props.applyFilter({
      value: this.state.filterValue ? this.state.filterValue.trim() : null
    });
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onRequestClose={this.props.cancel}
        onEscapeKeyUp={this.props.cancel}
      >
        <TranscriptSearchForm
          cancel={ this.props.cancel }
          defaultValue={ this.props.modalState.value }
          onSubmit={ this.applyFilterIfValue }
          onChange={ this.onChange }
          onKeyPress={ this.onEnter }
          inputValue={ this.state.filterValue }
        />
      </Dialog>
    );
  }
}

export const TranscriptSearchForm = ( { defaultValue, cancel, onSubmit, onChange, onKeyPress, inputValue } ) => {
  return (
  <div>
    <DialogTitle>Search Transcript</DialogTitle>
    <DialogContent style={{ width: '500px', margin: 'none' }}>
      <TextField
        id="transcript_search_field"
        autoFocus
        margin="none"
        defaultValue={ defaultValue }
        onChange={ onChange }
        onKeyPress={ onKeyPress }
        placeholder="Phrase to search"
        helperText="Searches within our database of transcripts."
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={ cancel } color="primary" className="transcriptCancel">
        Cancel
      </Button>
      <Button
        disabled={!inputValue && !defaultValue}
        onClick={ onSubmit }
        color="primary"
        className="transcriptSubmit"
        raised
      >
        Search
      </Button>
    </DialogActions>
  </div>
)}

TranscriptSearchModal.defaultProps = {
  modalState: { value: '' }
};

const TranscriptConditionGenerator = modalState => {
  return {
    operator: 'query_string',
    field: 'transcript.transcript',
    value: modalState.value.toLowerCase()
  };
};

const TranscriptDisplay = modalState => {
  return {
    abbreviation: modalState.value.substring(0, 10),
    thumbnail: null
  };
};

export {
  TranscriptSearchModal,
  TranscriptConditionGenerator,
  TranscriptDisplay
};
