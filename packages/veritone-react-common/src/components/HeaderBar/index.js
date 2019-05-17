import React from 'react';
import { arrayOf, shape, func, string, oneOf } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Popover,
  MenuList,
  MenuItem,
  Button
} from '@material-ui/core';
import {
  Sort,
  ViewList,
  ViewModule,
  ArrowDropDown,
  ArrowBack,
  AddBox
} from '@material-ui/icons'
import cx from 'classnames';
import { defaultVSDKTheme } from '../../helpers/withVeritoneSDKThemeProvider';

import Breadcrumbs from '../Breadcrumbs';
import SearchInput from '../SearchInput';

const styles = {
  root: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'stretch',
    paddingTop: 12,
    paddingBottom: 12,
    flexBasis: 66,
  },
  button: {
    flexBasis: 120
  },
  uploadButton: {
    border: `1px solid ${defaultVSDKTheme.palette.primary.main}`,
    borderRadius: '1px',
    color: defaultVSDKTheme.palette.primary.main,
  },
  backButton: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  iconButton: {
    marginRight: 8
  },
  icon: {
    color: 'rgba(0,0,0,0.26)'
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.26)',
    marginTop: 5,
    marginBottom: 5,
    alignSelf: 'stretch'
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  sort: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  view: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  spacer: {
    width: '1rem'
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.5
  }
};

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
      classes,
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
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar className={classes.header}>
            {
              currentPickerType === 'upload' ? (
                <Button
                  onClick={onBack}
                  className={cx(classes.button, classes.backButton)}
                >
                  <ArrowBack className={classes.iconButton} />
                    Back
                </Button>
              ) : (
                <Button
                  onClick={onUpload}
                  className={cx(classes.button, classes.uploadButton)}
                  variant="outlined"
                >
                  <AddBox className={classes.iconButton} />
                    Upload
                </Button>
              )
            }
            <div className={classes.spacer} />
            <Breadcrumbs
              pathList={pathList}
              onCrumbClick={onCrumbClick}
              isStream={currentPickerType==='stream'}
            />
            <div style={{ flexGrow: 1 }} />
            <div className={cx(
              classes.buttonGroup,
              classes.icon,
              { [classes.disabled]: currentPickerType === 'upload' }
              )}
            >
              <SearchInput
                onClear={onClear}
                onSearch={onSearch}
              />
              <div className={classes.spacer} />
              <div className={cx(classes.divider, classes.icon)} />
              <div className={classes.spacer} />
              <Sort onClick={this.onOpenSort} />
              <ArrowDropDown onClick={this.onOpenSort} />
              {
                viewType === 'list' ? (
                  <ViewList data-type="grid" onClick={onToggleView} />
                ) : (
                  <ViewModule data-type="list" onClick={onToggleView} />
                )
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
  classes: shape(Object.keys(styles).reduce((classesShape, key) => ({
    ...classesShape,
    [key]: string
  }), {})),
  pathList: arrayOf(shape({
    label: string,
    id: string
  })),
  onCrumbClick: func,
  onSearch: func,
  onClear: func,
  onBack: func,
  viewType: oneOf('list', 'grid'),
  onToggleView: func,
  onUpload: func,
  onSort: func,
  currentPickerType: oneOf('folder', 'stream', 'upload')
};

HeaderBar.defaultProps = {
  pathList: [
    {
      label: ''
    }
  ],
}

export default withStyles(styles)(HeaderBar);
