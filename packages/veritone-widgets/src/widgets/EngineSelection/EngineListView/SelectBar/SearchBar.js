import React from 'react';
import { bool, func, string } from 'prop-types';
import { debounce } from 'lodash';

import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import CloseIcon from 'material-ui-icons/Close';
import TextField from 'material-ui/TextField';
import { InputAdornment } from 'material-ui/Input';

import styles from './styles.scss';

export default class SearchBar extends React.Component {
  static propTypes = {
    searchQuery: string,
    onToggleSearch: func.isRequired,
    isOpen: bool.isRequired,
    onSearch: func.isRequired,
    onClearSearch: func.isRequired,
    isDisabled: bool.isRequired
  };

  static defaultProps = {
    isOpen: false,
    searchQuery: ''
  };

  componentWillMount(props) {
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

    console.log('this.props.searchQuery', this.props.searchQuery);
    console.log('event.target.value ', event.target.value);
    event.persist();
    this.forwardChange(event);
  };

  renderOpenedState = () => (
    <div>
      <TextField
        className={styles.searchBar}
        placeholder="Search by engine name"
        onChange={this.handleChange}
        // value={this.state.searchQuery}
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
        disabled={this.props.isDisabled}
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
