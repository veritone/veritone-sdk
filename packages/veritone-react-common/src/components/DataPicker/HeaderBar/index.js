import React from 'react';
import { arrayOf, shape, func, string, oneOf, bool } from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import SortIcon from '@material-ui/icons/Sort';
// import Sort from '@material-ui/icons/Sort';
// import ViewList from '@material-ui/icons/ViewList';
// import ViewModule from '@material-ui/icons/ViewModule';
// import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import cx from 'classnames';

import Breadcrumbs from '../Breadcrumbs';
// import SearchInput from '../SearchInput';
import styles from './styles.scss';

class HeaderBar extends React.Component {
  state = {
    anchorEl: null
  };

  sortAbilities = [
    {
      text: 'Name',
      type: 'name'
    },
    {
      text: 'Created date',
      type: 'createdDatetime'
    },
    {
      text: 'Modified date',
      type: 'modifiedDatetime'
    }
  ];

  onOpenSort = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  onSearchInputChange = event => {
    const { onSearch } = this.props;
    onSearch(event.currentTarget.value);
  };

  clickAway = () => {
    this.setState({
      anchorEl: null
    });
  };

  render() {
    const {
      // viewType,
      // onToggleView,
      onSort,
      // onSearch,
      // onClear,
      toggleContentView,
      onCrumbClick,
      pathList,
      currentPickerType,
      toggleMediaInfoPanel,
      showMediaInfoPanel
    } = this.props;
    const { anchorEl } = this.state;
    return (
      <div className={styles.root}>
        <AppBar
          position="static"
          color="default"
          className={styles['headerBar']}
        >
          <Toolbar className={styles.header}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => toggleContentView('upload')}
              className={styles.headerUploadButton}
            >
              Upload
            </Button>
            <Breadcrumbs
              pathList={pathList}
              onCrumbClick={onCrumbClick}
              isStream={currentPickerType === 'stream'}
            />
            {currentPickerType !== 'upload' && (
              <div className={styles.searchBar}>
                <TextField
                  onChange={this.onSearchInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </div>
            )}
            {currentPickerType !== 'upload' && (
              <div
                id="media-info-toggle"
                className={cx(styles['button-group'], styles.icon, {
                  [styles.disabled]: currentPickerType === 'upload'
                })}
              >
                {
                  // <SearchInput
                  //   onClear={onClear}
                  //   onSearch={onSearch}
                  // />
                  // <div className={styles.spacer} />
                  // <div className={cx(styles.divider, styles.icon)} />
                  // <div className={styles.spacer} />
                  // <Sort onClick={this.onOpenSort} />
                  // <ArrowDropDown onClick={this.onOpenSort} />
                  // {
                  //   viewType === 'list' ? (
                  //     <ViewList data-type="grid" onClick={onToggleView} />
                  //   ) : (
                  //     <ViewModule data-type="list" onClick={onToggleView} />
                  //   )
                  // }
                }
                <IconButton
                  data-veritone-element="media-panel-toggle"
                  color={showMediaInfoPanel ? 'primary' : 'default'}
                  /* eslint-disable react/jsx-no-bind */
                  onClick={() => toggleMediaInfoPanel()}
                >
                  <InfoOutlined />
                </IconButton>
                <IconButton>
                  <SortIcon />
                </IconButton>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClick={this.clickAway}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          <MenuList role="menu">
            {this.sortAbilities.map(({ text, type }) => (
              <MenuItem key={type} data-type={type} onClick={onSort}>
                {text}
              </MenuItem>
            ))}
          </MenuList>
        </Popover>
      </div>
    );
  }
}

HeaderBar.propTypes = {
  pathList: arrayOf(
    shape({
      label: string,
      id: string
    })
  ),
  onCrumbClick: func,
  onSearch: func,
  // onClear: func,
  // onBack: func,
  // viewType: oneOf(['list', 'grid']),
  // onToggleView: func,
  // onUpload: func,
  toggleContentView: func,
  onSort: func,
  currentPickerType: oneOf(['folder', 'stream', 'upload']),
  toggleMediaInfoPanel: func,
  showMediaInfoPanel: bool
};

HeaderBar.defaultProps = {
  pathList: [
    {
      label: ''
    }
  ]
};

export default HeaderBar;
