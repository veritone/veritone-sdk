import { truncate } from 'lodash';
import React from 'react';
import { bool, func, string, shape } from 'prop-types';


import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';

import { CardActions, CardContent } from '@material-ui/core/Card';

const getTranscriptLabel = modalState => {
  return {
    full: modalState.search,
    abbreviation: truncate(modalState.search, { length: 13 }),
    exclude: false
  };
};


export default class TranscriptSearchModal extends React.Component {
  static propTypes = {
    open: bool,
    modalState: shape({
      search: string,
      language: string
    }),
    cancel: func
  };
  static defaultProps = {
    modalState: {
      search: '',
      language: 'en'
    },
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

  returnValue() {
    if (!this.state.filterValue || this.state.filterValue.trim().length === 0) {
      return;
    } else {
      return {
        search: this.state.filterValue ? this.state.filterValue.trim() : null,
        language: 'en'
      };
    }
  }

  render() {
    return (
      <TranscriptSearchForm
        cancel={this.props.cancel}
        defaultValue={
          (this.props.modalState && this.props.modalState.search) || ''
        }
        onChange={this.onChange}
        inputValue={this.state.filterValue}
      />
    );
  }
}

export const TranscriptSearchForm = ({
  defaultValue,
  cancel,
  onChange,
  onKeyPress,
  inputValue
}) => {
  return (
    <TextField
      id="transcript_search_field"
      autoFocus
      margin="none"
      defaultValue={defaultValue}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder="Phrase to search"
      fullWidth
    />
  );
};

TranscriptSearchModal.propTypes = {
  defaultValue : string,
  cancel: func,
  onChange: func,
  onKeyPress: func,
  inputValue: string
}

TranscriptSearchModal.defaultProps = {
  modalState: { search: '', language: 'en' }
};

const TranscriptConditionGenerator = modalState => {
  return {
    operator: 'query_string',
    field: 'transcript.transcript',
    value: (modalState.search && modalState.search.toLowerCase()) || ''
  };
};

const TranscriptDisplay = modalState => {
  return {
    abbreviation:
      modalState.search && modalState.search.length > 10
        ? modalState.search.substring(0, 10) + '...'
        : modalState.search,
    exclude: false,
    thumbnail: null
  };
};

export {
  getTranscriptLabel,
  TranscriptSearchModal,
  TranscriptConditionGenerator,
  TranscriptDisplay
};



