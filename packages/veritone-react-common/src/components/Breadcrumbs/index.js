import React from 'react';
import { shape, string, number, arrayOf, oneOfType, node, func } from 'prop-types';
import { MenuList, Popover } from '@material-ui/core';

import BreadcrumbElipsis from './BreadcrumbElipsis';
import BreadcrumbItem from './BreadcrumbItem';

import styles from './Breadcrumbs.scss';

const DefaultSeparator = () => <span className="icon-keyboard_arrow_right" />;

export default class Breadcrumbs extends React.Component {
  static propTypes = {
    pathList: arrayOf(shape({
      id: string.isRequired,
    })),
    maxItems: number,
    seperator: oneOfType([string, node]),
    onScrumbClick: func.isRequired
  }

  static defaultProps = {
    maxItems: 5,
    seperator: <DefaultSeparator />,
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

  clickAwway = () => {
    this.anchorEl = null;
    this.setState({
      openSpreadPath: false
    })
  }

  onScrumbClick = (event) => {
    let elementData = Object.assign({}, event.target.dataset);
    if (Object.keys(elementData).length === 0) {
      elementData = Object.assign({}, event.target.parentNode.dataset);
    }
    this.props.onScrumbClick(elementData);
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
      0: rootScrumb,
      1: firstScrumb,
      [pathList.length - 1]: lastScrumb
    } = pathList;
    const midleScrumbs = pathList.slice(2, pathList.length - 1)

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
                  onClick={this.onScrumbClick}
                />
              </React.Fragment>
            ))
          ) : (
            <React.Fragment>
              <BreadcrumbItem
                {...rootScrumb}
                index={0}
                key={rootScrumb.id}
                onClick={this.onScrumbClick}
              />
              {seperator}
              <BreadcrumbItem
                {...firstScrumb}
                index={1}
                key={firstScrumb.id}
                onClick={this.onScrumbClick}
              />
              {seperator}
              <BreadcrumbElipsis onClick={this.onSpreadClick} />
              {seperator}
              <BreadcrumbItem
                {...lastScrumb}
                index={pathList.length - 1}
                key={lastScrumb.id}
                onClick={this.onScrumbClick}
              />
              <Popover
                open={Boolean(this.anchorEl)}
                anchorEl={this.anchorEl}
                onClick={this.clickAwway}
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
                    midleScrumbs.map(({ id, label }, index) => (
                      <BreadcrumbItem
                        key={id}
                        isHidden
                        id={id}
                        index={index + 2}
                        label={label}
                        onClick={this.onScrumbClick}
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
