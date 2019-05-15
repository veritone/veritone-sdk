import React from 'react';
import { func, string } from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import styles from './styles.scss';

const SearchInput = ({ onChange, onClear, value }) => (
  <div className={styles.search}>
    <div className={styles['search-icon']}>
      <SearchIcon />
    </div>
    <input
      className={styles['search-input']}
      placeholder="Search..."
      name="search"
      onChange={onChange}
      value={value}
    />
    <div className={styles['clear-icon']}>
      <ClearIcon onClick={onClear} />
    </div>
  </div>
);

SearchInput.propTypes = {
  onChange: func.isRequired,
  onClear: func.isRequired,
  value: string.isRequired
}

export default SearchInput;
