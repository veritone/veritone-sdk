import React from 'react';
import { func, shape, any } from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles } from '@material-ui/styles';

import styles from './styles';

class SearchInput extends React.Component {
  static propTypes = {
    onSearch: func.isRequired,
    onClear: func.isRequired,
    classes: shape({ any }),
  }

  state = {
    searchValue: ""
  }

  onChange = (event) => {
    this.setState({
      searchValue: event.target.value
    });
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.props.onSearch(event.target.value);
    }
  }

  onClear = event => {
    const { onClear } = this.props;
    onClear && onClear();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.search}>
        <div className={classes['searchIcon']}>
          <SearchIcon />
        </div>
        <input
          className={classes['searchInput']}
          placeholder="Search..."
          name="search"
          onChange={this.onChange}
          value={this.state.searchValue}
          onKeyPress={this.onKeyPress}
        />
        <div className={classes['clearIcon']}>
          <ClearIcon onClick={this.onClear} />
        </div>
      </div>
    )
  }
}

SearchInput.propTypes = {
  onSearch: func.isRequired,
  onClear: func.isRequired,
}

export default withStyles(styles)(SearchInput);
