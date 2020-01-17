import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ToolTip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';
import { bool, func, string, shape, any } from 'prop-types';

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
    filterValue: null || this.props.modalState.search,
    includeSpecialCharacters: this.props.modalState.includeSpecialCharacters || false
  };

  onChange = event => {
    this.setState({
      filterValue: event.target.value
    });
  };

  applyFilterIfValue = () => {
    if (!this.state.filterValue || this.state.filterValue.trim().length === 0) {
      this.props.applyFilter();
    } else {
      this.props.applyFilter(
        { search: this.state.filterValue ? this.state.filterValue.trim() : null, includeSpecialCharacters: this.state.includeSpecialCharacters }
      );
    }
  };

  returnValue() {
    if (!this.state.filterValue || this.state.filterValue.trim().length === 0) {
      return;
    } else {
      return ({ search: this.state.filterValue ? this.state.filterValue.trim() : null, includeSpecialCharacters: this.state.includeSpecialCharacters });
    }
  }

  toggleSpecialCharacters = (evt) => {
    this.setState({
      includeSpecialCharacters: evt.target.checked
    });
  }

  render() {
    return (
      <RecognizedTextSearchForm
        cancel={this.props.cancel}
        defaultValue={this.props.modalState.search}
        onSubmit={this.applyFilterIfValue}
        onChange={this.onChange}
        inputValue={this.state.filterValue}
        includeSpecialCharacters={this.state.includeSpecialCharacters}
        toggleSpecialCharacters={this.toggleSpecialCharacters}
      />
    );
  }
}

export const SpecialCharactersLabel = () => (
  <FormGroup row>
    <span>Include Special Characters</span>
    <ToolTip title="Results will include special characters and punctuation: !, *, +, %, $, etc.">
      <Info style={{ marginLeft: "0.25em", color: "#aaa" }} />
    </ToolTip>
  </FormGroup>
);

export const RecognizedTextSearchForm = ({ includeSpecialCharacters, toggleSpecialCharacters, defaultValue, onChange, onKeyPress }) => {
  return (
    <React.Fragment>
      <TextField
        id="text_search_field"
        autoFocus
        margin="none"
        defaultValue={defaultValue}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder="Text to search"
        fullWidth
      />
      <FormControl component="fieldset">
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={includeSpecialCharacters}
                onChange={toggleSpecialCharacters}
              />
            }
            label={<SpecialCharactersLabel />}
          />
        </FormGroup>
      </FormControl>
    </React.Fragment>
  )
};

RecognizedTextSearchForm.propTypes = {
  includeSpecialCharacters: bool,
  toggleSpecialCharacters: func,
  defaultValue: any,
  onChange: func,
  onKeyPress: func
}

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
