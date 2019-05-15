import React from 'react';
import { arrayOf, shape, func, string, bool } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Popover,
  MenuList,
  MenuItem
} from '@material-ui/core';
import {
  Work,
  Sort,
  ViewList,
  ViewModule,
  ArrowDropDown
} from '@material-ui/icons'
import cx from 'classnames';
import Breadcrumbs from '../Breadcrumbs';
import UploadButton from '../UploadButton';
import SearchInput from '../SearchInput';
import BackButton from '../BackButton';

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
      isStream,
      viewType,
      onToggleView,
      onSort,
      onSearch,
      onClear,
      onCrumbClick,
      pathList,
      searchValue
    } = this.props;
    const { anchorEl } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar className={classes.header}>
            {
              isStream ? (
                <BackButton onClick={onBack} />
              ) : (
                <UploadButton onClick={onUpload} />
              )
            }
            <div className={classes.spacer} />
            <Breadcrumbs pathList={pathList} onCrumbClick={onCrumbClick} />
            <div style={{ flexGrow: 1 }} />
            <div className={cx(
              classes.buttonGroup,
              classes.icon,
              { [classes.disabled]: isStream }
              )}
            >
              <SearchInput
                onClear={onClear}
                onChange={onSearch}
                value={searchValue}
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
    icon: string,
    id: string
  })),
  onCrumbClick: func,
  onSearch: func,
  onClear: func,
  onBack: func,
  isStream: bool,
  viewType: string,
  onToggleView: func,
  onUpload: func,
  onSort: func,
  searchValue: string.isRequired
};

HeaderBar.defaultProps = {
  pathList: [
    {
      icon: <Work style={{ color: "#2196F3" }} />,
      label: ''
    }
  ],
}

export default withStyles(styles)(HeaderBar);
