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
    isOpen: bool.isRequired,
    onSearch: func.isRequired,
    onClearSearch: func.isRequired,
    isDisabled: bool.isRequired
  };

  static defaultProps = {
    isOpen: false
  };

  state = {
    isOpen: this.props.isOpen
  };

  componentWillMount(props) {
    this.forwardChange = debounce(
      event => this.props.onSearch(event.target.value),
      300
    );
  }

  toggleSearchBar = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });

    if (this.state.isOpen && this.props.searchQuery) {
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
        onChange={this.handleChange}
        value={this.state.searchQuery}
        inputProps={{
          className: styles.searchBarInput
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment className={styles.searchBarIcon} position="end">
              <IconButton
                className={styles.searchBarIcon}
                onClick={this.toggleSearchBar}
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
        onClick={this.toggleSearchBar}
        className={styles.searchBarIcon}
        disabled={this.props.isDisabled}
      >
        <SearchIcon />
      </IconButton>
    </div>
  );

  render() {
    return this.state.isOpen
      ? this.renderOpenedState()
      : this.renderClosedState();
  }
}
