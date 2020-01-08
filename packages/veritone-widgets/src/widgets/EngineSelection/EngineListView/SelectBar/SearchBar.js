import React from 'react';
import { bool, func, string, shape, any } from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/styles';

import styles from './styles';

class SearchBar extends React.Component {
  static propTypes = {
    id: string.isRequired,
    searchQuery: string,
    onToggleSearch: func.isRequired,
    isOpen: bool,
    onSearch: func.isRequired,
    onClearSearch: func.isRequired,
    classes: shape({ any }),
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

    this.props.onSearch(event.target.value);
  };

  render() {
    const { classes } = this.props;

    return this.props.isOpen ? (
      <TextField
        className={classes.searchBar}
        placeholder="Search by engine name"
        value={this.state.searchQuery}
        onChange={this.handleChange}
        inputProps={{
          className: classes.searchBarInput
        }}
        InputProps={{
          classes: {
            underline: classes.searchBarUnderline
          },
          endAdornment: (
            <InputAdornment className={classes.searchBarIcon} position="end">
              <IconButton
                className={classes.searchBarIcon}
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
          className={classes.searchBarIcon}
        >
          <SearchIcon />
        </IconButton>
      );
  }
}

export default withStyles(styles)(SearchBar);
