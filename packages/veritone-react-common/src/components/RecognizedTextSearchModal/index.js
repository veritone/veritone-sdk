import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { FormHelperText } from 'material-ui/Form';

import ModalSubtitle from '../ModalSubtitle';

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

  applyFilterIfValue = () => {
    if(!this.state.filterValue || this.state.filterValue.trim().length === 0) {
      this.props.applyFilter();
    } else {
      this.props.applyFilter(
        { search: this.state.filterValue ? this.state.filterValue.trim() : null }
      );
    }
  };

  returnValue() {
    if(!this.state.filterValue || this.state.filterValue.trim().length === 0) {
      return;
    } else {
      return ( { search: this.state.filterValue ? this.state.filterValue.trim() : null } );
    }
  }

  render() {
    return (
      <RecognizedTextSearchForm
        cancel={ this.props.cancel }
        defaultValue={ this.props.modalState.search }
        onSubmit={ this.applyFilterIfValue }
        onChange={ this.onChange }
        inputValue={ this.state.filterValue }
      />
    );
  }
}

export const RecognizedTextSearchForm = ( { defaultValue, cancel, onSubmit, onChange, onKeyPress, inputValue } ) => {
  return (
    <TextField
      id="text_search_field"
      autoFocus
      margin="none"
      defaultValue={ defaultValue }
      onChange={ onChange }
      onKeyPress={ onKeyPress }
      placeholder="Text to search"
      fullWidth
    />
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
    exclude: modalState.exclude,
    thumbnail: null
  };
};

export {
  RecognizedTextSearchModal,
  RecognizedTextConditionGenerator,
  RecognizedTextDisplay
};
