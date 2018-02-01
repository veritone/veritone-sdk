import React from 'react';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormHelperText } from 'material-ui/Form';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';

import { bool, func, string, shape } from 'prop-types';

export default class SentimentSearchModal extends React.Component {
  static propTypes = {
    open: bool,
    modalState: shape({ search: string }),
    applyFilter: func,
    cancel: func
  };
  static defaultProps = {
    applyFilter: value => console.log('Search sentiment', value),
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

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.cancel}
      >
        <SentimentSearchForm
          cancel={ this.props.cancel }
          onSubmit={ this.applyFilterIfValue }
          onChange={ this.onChange }
          inputValue={ this.state.filterValue }
        />
      </Dialog>
    );
  }
}

export const SentimentSearchForm = ( { cancel, onSubmit, onChange, inputValue } ) => {
  return (
    <div>
      <DialogTitle>Search by Sentiment</DialogTitle>
      <DialogContent style={{ width: '500px', margin: 'none' }}>
        <Select
          id="sentiment_search_field"
          margin="none"
          value={ inputValue }
          onChange={ onChange }>
          <MenuItem value={'positive'}>Positive</MenuItem>
          <MenuItem value={'negative'}>Negative</MenuItem>
        </Select>
        <FormHelperText>Discover positive and negative sentiment inside of audio and video files.</FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button onClick={ cancel } color="primary" className="sentimentSearchCancel">
          Cancel
        </Button>
        <Button
          onClick={ onSubmit }
          color="primary"
          className="sentimentSearchSubmit"
          raised
        >
          Search
        </Button>
      </DialogActions>
    </div>
  )};

SentimentSearchModal.defaultProps = {
  modalState: { search: 'positive' }
};

const SentimentConditionGenerator = modalState => {
  const sentimentOperator = {
    operator: "range",
    field: "sentiment-veritone.series.score"
  };
  if (modalState.search == 'positive') {
    sentimentOperator.gte = "0.5";
  } else {
    sentimentOperator.lt = "0.5";
  }
  return sentimentOperator;
};

const SentimentDisplay = modalState => {
  return {
    abbreviation: modalState.search === 'positive' ? 'Positive' : 'Negative',
    thumbnail: null
  };
};

export {
  SentimentSearchModal,
  SentimentConditionGenerator,
  SentimentDisplay
};
