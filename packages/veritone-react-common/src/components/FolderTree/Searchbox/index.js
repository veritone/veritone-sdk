import React from 'react';
import cx from 'classnames';
import { func, string } from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import styles from './styles.scss';

export default function Searchbox({
  onSearch,
  placeholder = 'Search'
}) {
  const inputRef = React.createRef();
  const [focusing, setFocusing] = React.useState(false);
  const [data, setData] = React.useState('');
  function handleSearch() {
    if (!focusing && !data) {
      setFocusing(true);
      inputRef.current.focus();
    } else {
      setFocusing(false);
      if (data) {
        onSearch(data);
      }
    }
  }
  function handleChangeInput(event) {
    setData(event.target.value);
  }
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      onSearch(data);
    }
  }
  return (
    <div className={cx(styles['search-box-root'])}>
      <InputBase
        onChange={handleChangeInput}
        inputRef={inputRef}
        className={cx(styles['input'])}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'Search-input' }}
        onKeyDown={handleKeyDown}
      />
      <IconButton
        onClick={handleSearch}
        className={cx(styles['icon-button'])}
        aria-label="search-button"
      >
        <SearchIcon />
      </IconButton>
    </div>
  );
}
Searchbox.propTypes = {
  onSearch: func.isRequired,
  placeholder: string
}
