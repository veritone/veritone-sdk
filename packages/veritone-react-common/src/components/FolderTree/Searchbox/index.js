import React from 'react';
import { func, string } from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';

const useStyles = makeStyles(theme => ({
  ...styles
}));

export default function Searchbox({
  onSearch,
  placeholder = 'Search'
}) {
  const classes = useStyles();
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
    <div className={classes.searchBoxRoot}>
      <InputBase
        onChange={handleChangeInput}
        inputRef={inputRef}
        className={classes.input}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'Search-input' }}
        onKeyDown={handleKeyDown}
      />
      <IconButton
        onClick={handleSearch}
        className={classes.iconButton}
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
