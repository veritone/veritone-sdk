import React from 'react';
import { arrayOf, shape, func, string, oneOf, bool, any } from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
// import Sort from '@material-ui/icons/Sort';
// import ViewList from '@material-ui/icons/ViewList';
// import ViewModule from '@material-ui/icons/ViewModule';
// import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import cx from 'classnames';
import { withStyles } from '@material-ui/styles';

import Breadcrumbs from '../Breadcrumbs';
// import SearchInput from '../SearchInput';
import styles from './styles';

class HeaderBar extends React.Component {

  state = {
    anchorEl: null,
  }

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
  ]

  onOpenSort = (event) => {
    this.setState({
      anchorEl: event.currentTarget
    })
  }

  clickAway = () => {
    this.setState({
      anchorEl: null
    })
  }

  render() {
    const {
      // viewType,
      // onToggleView,
      onSort,
      // onSearch,
      // onClear,
      onCrumbClick,
      pathList,
      currentPickerType,
      toggleMediaInfoPanel,
      showMediaInfoPanel,
      classes
    } = this.props;
    const { anchorEl } = this.state;
    return (
      <div className={classes.root}>
        <AppBar
          position="static"
          color="default"
          className={classes['headerBar']}
        >
          <Toolbar className={classes.header}>
            <Breadcrumbs
              pathList={pathList}
              onCrumbClick={onCrumbClick}
              isStream={currentPickerType === 'stream'}
            />
            {currentPickerType !== 'upload' && (<div style={{ flexGrow: 1 }} />)}
            {currentPickerType !== 'upload' && (
              <div
                id="media-info-toggle"
                className={cx(
                  classes['buttonGroup'],
                  classes.icon,
                  { [classes.disabled]: currentPickerType === 'upload' }
                )
                }
              >
                {
                  // <SearchInput
                  //   onClear={onClear}
                  //   onSearch={onSearch}
                  // />
                  // <div className={classes.spacer} />
                  // <div className={cx(classes.divider, classes.icon)} />
                  // <div className={classes.spacer} />
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
                  onClick={() => toggleMediaInfoPanel()}>
                  <InfoOutlined />
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
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuList role="menu">
            {
              this.sortAbilities.map(({ text, type }) => (
                <MenuItem key={type} data-type={type} onClick={onSort}>
                  {text}
                </MenuItem>
              ))
            }
          </MenuList>
        </Popover>
      </div>
    );
  }
}

HeaderBar.propTypes = {
  pathList: arrayOf(shape({
    label: string,
    id: string
  })),
  onCrumbClick: func,
  // onSearch: func,
  // onClear: func,
  // onBack: func,
  // viewType: oneOf(['list', 'grid']),
  // onToggleView: func,
  // onUpload: func,
  onSort: func,
  currentPickerType: oneOf(['folder', 'stream', 'upload']),
  toggleMediaInfoPanel: func,
  showMediaInfoPanel: bool,
  classes: shape({ any })
};

HeaderBar.defaultProps = {
  pathList: [
    {
      label: ''
    }
  ],
}

export default withStyles(styles)(HeaderBar);
