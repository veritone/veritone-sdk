import React from 'react';
import { func, string } from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import styles from './styles';

const useStyles = makeStyles(() => ({
  ...styles
}));

export default function Searchbox({
  onSearch,
  onClearSearch,
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
      if(!data && onClearSearch) {
        onClearSearch();
        return;
      }
      onSearch(data);
    }
  }
  function handleRemoveText() {
    setData('');
    if (onClearSearch) {
      onClearSearch();
    } else {
      onSearch('');
    }
  }
  return (
    <div data-test="folderTreeSearchBox" className={classes.searchBoxRoot}>
      <InputBase
        onChange={handleChangeInput}
        inputRef={inputRef}
        value={data}
        className={classes.input}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'Search-input' }}
        onKeyDown={handleKeyDown}
      />
      {data !== '' ? (
        <IconButton
          className={classes.iconButton}
          onClick={handleRemoveText}
          size="small"
        >
          <CloseIcon color="action" />
        </IconButton>
      ) : (
          <IconButton
            onClick={handleSearch}
            className={classes.iconButton}
            aria-label="search-button"
          >
            <SearchIcon />
          </IconButton>
        )}
    </div>
  );
}
Searchbox.propTypes = {
  onSearch: func.isRequired,
  placeholder: string,
  onClearSearch: func,
};
