import React from 'react';
import { bool, func, string } from 'prop-types';
import { debounce } from 'lodash';

import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import styles from './styles.scss';

export default class SearchBar extends React.Component {
  static propTypes = {
    searchQuery: string,
    onToggleSearch: func.isRequired,
    isOpen: bool,
    onSearch: func.isRequired,
    onClearSearch: func.isRequired
  };

  static defaultProps = {
    isOpen: false,
    searchQuery: ''
  };

  UNSAFE_componentWillMount(props) {
    this.forwardChange = debounce(
      event => this.props.onSearch(event.target.value),
      300
    );
  }

  handleToggleSearch = () => {
    this.props.onToggleSearch();

    if (this.props.isOpen && this.props.searchQuery) {
      this.props.onClearSearch();
    }
  };

  handleChange = event => {
    if (!event.target.value || event.target.value === this.props.searchQuery) {
      return;
    }

    event.persist();
    this.forwardChange(event);
  };

  renderOpenedState = () => (
    <div>
      <TextField
        className={styles.searchBar}
        placeholder="Search by engine name"
        defaultValue={this.props.searchQuery}
        onChange={this.handleChange}
        inputProps={{
          className: styles.searchBarInput
        }}
        InputProps={{
          classes: {
            underline: styles.searchBarUnderline
          },
          endAdornment: (
            <InputAdornment className={styles.searchBarIcon} position="end">
              <IconButton
                className={styles.searchBarIcon}
                onClick={this.handleToggleSearch}
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </div>
  );

  renderClosedState = () => (
    <div>
      <IconButton
        onClick={this.handleToggleSearch}
        className={styles.searchBarIcon}
      >
        <SearchIcon />
      </IconButton>
    </div>
  );

  render() {
    return this.props.isOpen
      ? this.renderOpenedState()
      : this.renderClosedState();
  }
}
