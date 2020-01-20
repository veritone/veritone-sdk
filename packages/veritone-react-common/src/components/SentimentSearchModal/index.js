import React from 'react';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';

import ModalSubtitle from '../ModalSubtitle';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import { bool, func, string, shape } from 'prop-types';
import cx from 'classnames';
import styles from './styles';

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
    if (!this.state.filterValue || this.state.filterValue.trim().length === 0) {
      this.props.applyFilter();
    } else {
      this.props.applyFilter(
        { search: this.state.filterValue ? this.state.filterValue.trim() : null }
      );
    }
  };

  returnValue() {
    if (!this.state.filterValue || this.state.filterValue.trim().length === 0) {
      return;
    } else {
      return ({ search: this.state.filterValue ? this.state.filterValue.trim() : null });
    }
  }

  render() {
    return (
      <SentimentSearchForm
        cancel={this.props.cancel}
        onSubmit={this.applyFilterIfValue}
        onChange={this.onChange}
        inputValue={this.state.filterValue}
      />
    );
  }
}


const useStyles = makeStyles(styles);

export const SentimentSearchForm = ({ cancel, onSubmit, onChange, inputValue }) => {
  const classes = useStyles();
  const selectHackClass = cx(classes['material']);
  
  return (
    <Select
      classes={{ select: selectHackClass }}
      native
      style={{ width: "200px", boxShadow: "none" }}
      value={inputValue}
      onChange={onChange}
    >
      <option value={'positive'}>Positive</option>
      <option value={'negative'}>Negative</option>
    </Select>
  )
};

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
    exclude: false,
    thumbnail: null
  };
};

export {
  SentimentSearchModal,
  SentimentConditionGenerator,
  SentimentDisplay
};
