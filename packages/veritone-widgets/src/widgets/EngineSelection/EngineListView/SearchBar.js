import React from 'react';
import { bool, func } from 'prop-types';
import { debounce } from 'lodash';

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
    isOpen: this.props.isOpen,
    searchTerm: ''
  }

  componentWillMount(props) {
    this.forwardChange = debounce((evt) => this.props.onSearch(this.state.searchTerm), 300);
  }

  toggleSearchBar = () => {
    this.setState({
      isOpen: !this.state.isOpen,
      searchTerm: this.state.isOpen ? '' : this.state.searchTerm
    })

    if (this.state.isOpen) {
      this.props.onClear();
    }
  }

  handleChange = evt => {
    this.setState({
      searchTerm: evt.target.value,
    });
    this.forwardChange(evt);
  }

  _renderOpenedState = () => (
    <div>
      <LibTextField
        className={styles.searchBar}
        placeholder="Search by engine name"
        onChange={this.handleChange}
        value={this.state.searchTerm}
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
      >
        <SearchIcon />
      </IconButton>
    </div>
  )

  render() {
    return (
      this.state.isOpen ?
        this._renderOpenedState() :
        this._renderClosedState()
    )
  }
}
