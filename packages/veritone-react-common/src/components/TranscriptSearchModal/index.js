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
        <DialogTitle>Search By Keyword</DialogTitle>
        <DialogContent style={{ width: '500px', margin: 'none' }}>
          <TextField
            id="full-width"
            autoFocus
            margin="none"
            defaultValue={this.props.modalState.value}
            onChange={this.onChange}
            onKeyPress={this.onEnter}
            placeholder="Keyword(s)"
            helperText="Searches within our database of media transcripts."
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.cancel} color="primary">
            Cancel
          </Button>
          <Button
            disabled={!this.state.filterValue && !this.props.modalState.value}
            onClick={this.applyFilterIfValue}
            color="primary"
            raised
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

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
