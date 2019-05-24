import React from 'react';
import { shape, string, number, arrayOf, oneOfType, node, func, bool } from 'prop-types';
import cx from 'classnames';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import { ChevronRight, MoreHoriz, Work } from '@material-ui/icons';

import BreadcrumbItem from './BreadcrumbItem';

import styles from './styles.scss';

export default class Breadcrumbs extends React.Component {
  static propTypes = {
    pathList: arrayOf(shape({
      id: string.isRequired,
      label: string
    })),
    maxItems: number,
    seperator: oneOfType([string, node]),
    onCrumbClick: func.isRequired,
    isStream: bool
  }

  static defaultProps = {
    maxItems: 5,
    seperator: <ChevronRight className={styles['icon-color']} />,
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
    } = this.props;

    const { anchorEl } = this.state;

    const {
      0: rootCrumb,
      1: secondCrumb,
      [pathList.length - 1]: lastCrumb
    } = pathList;
    const hiddenCrumbs = pathList.slice(2, pathList.length - 1);
    const icon = isStream ? (
      <div className={cx('icon-streams', styles['root-icon'])} />
    ) : <Work className={styles['root-icon']} />;

    return (
      <div className={styles['breadcrumb-container']}>
        {
          pathList.length < maxItems ? (
            pathList.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                {
                  index === 0 && (
                    <BreadcrumbItem
                      {...crumb}
                      icon={icon}
                      index={index}
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
                    index={index}
                    key={crumb.id}
                    onClick={this.onCrumbClick}
                  />
                }
              </React.Fragment>
            ))
          ) : (
              <React.Fragment>
                <BreadcrumbItem
                  {...rootCrumb}
                  icon={icon}
                  index={0}
                  key={rootCrumb.id}
                  onClick={this.onCrumbClick}
                />
                {seperator}
                <BreadcrumbItem
                  {...secondCrumb}
                  index={1}
                  key={secondCrumb.id}
                  onClick={this.onCrumbClick}
                />
                {seperator}
                <MoreHoriz
                  onClick={this.onSpreadClick}
                  className={styles['icon-color']}
                />
                {seperator}
                <BreadcrumbItem
                  {...lastCrumb}
                  index={pathList.length - 1}
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
                      hiddenCrumbs.map(({ id, label }, index) => (
                        <BreadcrumbItem
                          key={id}
                          isHidden
                          id={id}
                          index={index + 2}
                          label={label}
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
