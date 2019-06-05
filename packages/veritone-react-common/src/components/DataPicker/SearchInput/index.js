import React from 'react';
import { func } from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import styles from './styles.scss';

class SearchInput extends React.Component {
  static propTypes = {
    onSearch: func.isRequired,
    onClear: func.isRequired,
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
    return (
      <div className={styles.search}>
        <div className={styles['search-icon']}>
          <SearchIcon />
        </div>
        <input
          className={styles['search-input']}
          placeholder="Search..."
          name="search"
          onChange={this.onChange}
          value={this.state.searchValue}
          onKeyPress={this.onKeyPress}
        />
        <div className={styles['clear-icon']}>
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

export default SearchInput;
