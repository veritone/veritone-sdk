import React from 'react';
import { bool, func, string } from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import styles from './styles.scss';

export default class SearchBar extends React.Component {
  static propTypes = {
    id: string.isRequired,
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

  state = {
    searchQuery: this.props.searchQuery
  };

  handleToggleSearch = () => {
    this.props.onToggleSearch(this.props.id);

    if (this.props.isOpen && this.props.searchQuery) {
      this.props.onClearSearch(this.props.id);
    }
  };

  handleChange = event => {
    this.setState({
      searchQuery: event.target.value
    });

    event.persist();
    this.props.onSearch(event);
  };

  render() {
    return this.props.isOpen ? (
      <TextField
        className={styles.searchBar}
        placeholder="Search by engine name"
        value={this.state.searchQuery}
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
    ) : (
      <IconButton
        onClick={this.handleToggleSearch}
        className={styles.searchBarIcon}
      >
        <SearchIcon />
      </IconButton>
    );
  }
}
