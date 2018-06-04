import React from 'react';
import { func } from 'prop-types';

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

import Grow from '@material-ui/core/Grow';

import cx from 'classnames';
import styles from './styles.scss';

class ExpandableSearchField extends React.Component {
  static propTypes = {
    onSearch: func
  };

  state = {
    expanded: false,
    search: ''
  };

  resetSearch = evt => {
    this.setState({
      search: '',
      expanded: true
    });
    if (this._inputRef) {
      this._inputRef.focus();
    }
  };

  showSearchBar = evt => {
    this.setState({
      expanded: true
    });
  };

  hideSearchBar = evt => {
    if (!this.state.search || this.state.search.trim().length === 0) {
      this.setState({
        expanded: false
      });
    }
  };

  onChange = evt => {
    this.setState({
      search: evt.target.value
    });
  };

  onKeyPress = evt => {
    if (
      evt.key === 'Enter' &&
      this.props.onSearch &&
      evt.target.value &&
      evt.target.value.trim().length > 0
    ) {
      this.props.onSearch(evt.target.value.trim());
    }
  };

  setInputRef = ref => {
    this._inputRef = ref;
  };

  render() {
    if (this.state.expanded) {
      return (
        <Grow in>
          <TextField
            value={this.state.search}
            autoFocus
            inputProps={{
              onBlur: this.hideSearchBar
            }}
            inputRef={this.setInputRef}
            onKeyPress={this.onKeyPress}
            onChange={this.onChange}
            InputProps={{
              classes: {
                underline: cx(styles['underline'])
              },
              endAdornment: (
                <IconButton onClick={this.resetSearch} disableRipple>
                  <CloseIcon />
                </IconButton>
              )
            }}
          />
        </Grow>
      );
    } else {
      return (
        <IconButton onClick={this.showSearchBar}>
          <SearchIcon />
        </IconButton>
      );
    }
  }
}

export default ExpandableSearchField;
