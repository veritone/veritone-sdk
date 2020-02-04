import React from 'react';
import TextField from '@material-ui/core/TextField';

import { bool, func, string, shape, any } from 'prop-types';

export default class DocumentSearchModal extends React.Component {
  static propTypes = {
    open: bool,
    modalState: shape({ search: string, language: string }),
    cancel: func,
  };

  static defaultProps = {
    modalState: { search: '', language: 'en' },
    cancel: () => console.log('You clicked cancel'),
  };

  state = {
    filterValue: null || this.props.modalState.search,
  };

  onChange = event => {
    this.setState({
      filterValue: event.target.value,
    });
  };

  returnValue() {
    if (!this.state.filterValue || this.state.filterValue.trim().length === 0) {
      return {};
    }
    return {
      search: this.state.filterValue ? this.state.filterValue.trim() : null,
      language: 'en',
    };
  }

  render() {
    return (
      <DocumentSearchForm
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

export const DocumentSearchForm = ({ defaultValue, onChange, onKeyPress }) => (
  <TextField
    id="document_search_field"
    margin="none"
    defaultValue={defaultValue}
    onChange={onChange}
    onKeyPress={onKeyPress}
    placeholder="Search for words, numbers, or full sentences"
    fullWidth
  />
);

DocumentSearchForm.propTypes = {
  defaultValue: any,
  onChange: func,
  onKeyPress: func,
};

DocumentSearchModal.defaultProps = {
  modalState: { search: '', language: 'en' },
};

const DocumentConditionGenerator = modalState => ({
  operator: 'query_string',
  field: 'text-document.text',
  value: (modalState.search && modalState.search.toLowerCase()) || '',
});

const DocumentDisplay = modalState => ({
  abbreviation:
    modalState.search && modalState.search.length > 10
      ? `${modalState.search.substring(0, 10)}...`
      : modalState.search,
  exclude: false,
  thumbnail: null,
});

export { DocumentSearchModal, DocumentConditionGenerator, DocumentDisplay };
