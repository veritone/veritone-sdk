import React from 'react';
import { shape, string, number, arrayOf, oneOfType, node, func } from 'prop-types';
import { MenuList, Popover } from '@material-ui/core';
import { ChevronRight, MoreVert } from '@material-ui/icons';
import classNames from 'classnames';

import BreadcrumbItem from './BreadcrumbItem';

import styles from './Breadcrumbs.scss';

export default class Breadcrumbs extends React.Component {
  static propTypes = {
    pathList: arrayOf(shape({
      id: string.isRequired,
    })),
    maxItems: number,
    seperator: oneOfType([string, node]),
    onCrumbClick: func.isRequired
  }

  static defaultProps = {
    maxItems: 5,
    seperator: <ChevronRight className={styles['icon-color']} />,
  }

  state = {
    openSpreadPath: false
  }

  onSpreadClick = (event) => {
    this.anchorEl = event.target;
    this.setState(({ openSpreadPath }) => ({
      openSpreadPath: !openSpreadPath
    }));
  }

  clickAway = () => {
    this.anchorEl = null;
    this.setState({
      openSpreadPath: false
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
    } = this.props;

    const {
      0: rootCrumb,
      1: secondCrumb,
      [pathList.length - 1]: lastCrumb
    } = pathList;
    const hiddenCrumbs = pathList.slice(2, pathList.length - 1)

    return (
      <div className={styles['breadcrumb-container']}>
        {
          pathList.length < maxItems ? (
            pathList.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                {index > 0 && seperator}
                <BreadcrumbItem
                  {...crumb}
                  index={index}
                  key={crumb.id}
                  onClick={this.onCrumbClick}
                />
              </React.Fragment>
            ))
          ) : (
              <React.Fragment>
                <BreadcrumbItem
                  {...rootCrumb}
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
                <MoreVert
                  onClick={this.onSpreadClick}
                  className={classNames(styles['icon-spread'], styles['icon-color'])}
                />
                {seperator}
                <BreadcrumbItem
                  {...lastCrumb}
                  index={pathList.length - 1}
                  key={lastCrumb.id}
                  onClick={this.onCrumbClick}
                />
                <Popover
                  open={Boolean(this.anchorEl)}
                  anchorEl={this.anchorEl}
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
