import React from 'react';
import { arrayOf, shape, func, string, oneOf } from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Sort from '@material-ui/icons/Sort';
import ViewList from '@material-ui/icons/ViewList';
import ViewModule from '@material-ui/icons/ViewModule';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowBack from '@material-ui/icons/ArrowBack';
import AddBox from '@material-ui/icons/AddBox';
import cx from 'classnames';

import Breadcrumbs from '../Breadcrumbs';
import SearchInput from '../SearchInput';
import styles from './styles.scss';


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
      onUpload,
      onBack,
      viewType,
      onToggleView,
      onSort,
      onSearch,
      onClear,
      onCrumbClick,
      pathList,
      currentPickerType
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
            {
              currentPickerType === 'upload' ? (
                <Button
                  onClick={onBack}
                  className={cx(styles.button, styles['back-button'])}
                >
                  <ArrowBack className={styles['icon-button']} />
                    Back
                </Button>
              ) : (
                <Button
                  onClick={onUpload}
                  className={cx(styles.button, styles['upload-button'])}
                  variant="outlined"
                >
                  <AddBox className={styles['icon-button']} />
                    Upload
                </Button>
              )
            }
            <div className={styles.spacer} />
            <Breadcrumbs
              pathList={pathList}
              onCrumbClick={onCrumbClick}
              isStream={currentPickerType==='stream'}
            />
            <div style={{ flexGrow: 1 }} />
            <div className={cx(
              styles['button-group'],
              styles.icon,
              { [styles.disabled]: currentPickerType === 'upload' }
              )}
            >
              <SearchInput
                onClear={onClear}
                onSearch={onSearch}
              />
              {
                // <div className={styles.spacer} />
                // <div className={cx(styles.divider, styles.icon)} />
                // <div className={styles.spacer} />
                // <Sort onClick={this.onOpenSort} />
                // <ArrowDropDown onClick={this.onOpenSort} />
              }
              {
                // viewType === 'list' ? (
                //   <ViewList data-type="grid" onClick={onToggleView} />
                // ) : (
                //   <ViewModule data-type="list" onClick={onToggleView} />
                // )
              }
            </div>
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
  onSearch: func,
  onClear: func,
  onBack: func,
  viewType: oneOf(['list', 'grid']),
  onToggleView: func,
  onUpload: func,
  onSort: func,
  currentPickerType: oneOf(['folder', 'stream', 'upload'])
};

HeaderBar.defaultProps = {
  pathList: [
    {
      label: ''
    }
  ],
}

export default HeaderBar;
