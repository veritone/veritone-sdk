import React from 'react';
import { bool, func } from 'prop-types';

import LibCheckbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import CloseIcon from 'material-ui-icons/Close';
import LibTextField from 'material-ui/TextField';
import { InputAdornment } from 'material-ui/Input';

import styles from './styles.scss';

export default class SearchBar extends React.Component {
  static propTypes = {
    isOpen: bool.isRequired
  };

  static defaultProps = {
    isOpen: false
  };

  state = {
    isOpen: this.props.isOpen
  }

  toggleSearchBar = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  handleChange = evt => {
    this.props.onSearch(evt.target.value)
  }

  // clearSearch to reset results

  _renderOpenedState = () => (
    <div>
      <LibTextField
        className={styles.searchBar}
        placeholder="Search by name"
        onChange={this.handleChange}
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
  )

  _renderClosedState = () => (
    <div>
      <IconButton
        onClick={this.toggleSearchBar}
        className={styles.searchBarIcon}
        // iconStyle={styles.iconButtonSearch.iconStyle}
        // style={styles.iconButtonSearch.style}
        // disabled={false}
      >
        <SearchIcon />
      </IconButton>
    </div>
  )

  render() {
    return (
      this.state.isOpen ? this._renderOpenedState() : this._renderClosedState()
    )
  }
}
