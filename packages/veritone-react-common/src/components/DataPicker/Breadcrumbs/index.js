import React from 'react';
import {
  shape,
  string,
  number,
  arrayOf,
  oneOfType,
  node,
  func,
  bool,
  any
} from 'prop-types';
import cx from 'classnames';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ChevronRight, MoreHoriz, Work } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';

import BreadcrumbItem from './BreadcrumbItem';
import styles, { lightBlackColor } from './styles';

class Breadcrumbs extends React.Component {
  static propTypes = {
    pathList: arrayOf(shape({
      id: string.isRequired,
      name: string
    })),
    maxItems: number,
    seperator: oneOfType([string, node]),
    onCrumbClick: func.isRequired,
    isStream: bool,
    classes: shape({ any }),
    isEnableSuiteCase: bool,
    isEnableBackground: bool,
    defaultRootTitle: string,
    loading: bool
  }

  static defaultProps = {
    maxItems: 5,
    seperator: <ChevronRight style={{ color: lightBlackColor }} />,
  }

  state = {
    anchorEl: null
  }

  onSpreadClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget
    })
  }

  clickAway = () => {
    this.setState({
      anchorEl: null
    })
  }

  onCrumbClick = (event) => {
    let elementData = Object.assign({}, event.currentTarget.dataset);
    this.props.onCrumbClick(elementData);
  }

  handleClose = (event) => {
    event.stopPropagation();
  }

  render() {
    const {
      pathList,
      maxItems,
      seperator,
      isStream,
      classes,
      isEnableSuiteCase = true,
      isEnableBackground = true,
      defaultRootTitle = 'My Files',
      loading = false
    } = this.props;

    const { anchorEl } = this.state;

    const {
      0: firstCrumb,
      [pathList.length - 1]: lastCrumb
    } = pathList;
    const hiddenCrumbs = pathList.slice(1, pathList.length - 1);
    const icon = isStream ? (
      <div className={cx('icon-streams', classes['rootIcon'])} />
    ) : <Work className={classes['rootIcon']} />;
    if (loading) {
      return (
        <div
          className={cx(
            classes.breadcrumbContainer,
            isEnableBackground ? classes.greyBackround : {})
          }
        >
          <CircularProgress size={20} />
        </div>
      )
    }
    return (
      <div
        className={cx(
          classes.breadcrumbContainer,
          isEnableBackground ? classes.greyBackround : {})
        }
      >
        {isEnableSuiteCase && (
          <React.Fragment key={'root'}>
            <BreadcrumbItem
              id={'root'}
              icon={icon}
              index={0}
              key={'root'}
              name={pathList.length ? '' : defaultRootTitle}
              onClick={this.onCrumbClick}
            />
            {!!pathList.length && seperator}
          </React.Fragment>
        )}
        {
          pathList.length < maxItems ? (
            pathList.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                {
                  index === 0 && (
                    <BreadcrumbItem
                      {...crumb}
                      index={index + 1}
                      key={crumb.id}
                      onClick={this.onCrumbClick}
                    />
                  )
                }
                {index > 0 && seperator}
                {
                  index > 0 &&
                  <BreadcrumbItem
                    {...crumb}
                    index={index + 1}
                    key={crumb.id}
                    onClick={this.onCrumbClick}
                  />
                }
              </React.Fragment>
            ))
          ) : (
              <React.Fragment>
                <BreadcrumbItem
                  {...firstCrumb}
                  index={1}
                  key={firstCrumb.id}
                  onClick={this.onCrumbClick}
                />
                {seperator}
                <Button
                  className={classes['crumbItem']}
                  onClick={this.onSpreadClick}
                >
                  <MoreHoriz className={classes['iconColor']} />
                </Button>
                {seperator}
                <BreadcrumbItem
                  {...lastCrumb}
                  index={pathList.length}
                  key={lastCrumb.id}
                  onClick={this.onCrumbClick}
                />
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
                      hiddenCrumbs.map(({ id, name }, index) => (
                        <BreadcrumbItem
                          key={id}
                          isHidden
                          id={id}
                          index={index + 2}
                          name={name}
                          onClick={this.onCrumbClick}
                        />
                      ))
                    }
                  </MenuList>
                </Popover>
              </React.Fragment>
            )
        }
      </div>
    )
  }
}

export default withStyles(styles)(Breadcrumbs); 
