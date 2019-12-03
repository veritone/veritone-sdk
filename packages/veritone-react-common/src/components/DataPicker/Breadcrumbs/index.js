import React from 'react';
import { shape, string, number, arrayOf, oneOfType, node, func, bool } from 'prop-types';
import cx from 'classnames';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import { ChevronRight, MoreHoriz, Work } from '@material-ui/icons';

import BreadcrumbItem from './BreadcrumbItem';

import styles from './styles.scss';

export default class Breadcrumbs extends React.Component {
  static propTypes = {
    pathList: arrayOf(shape({
      id: string.isRequired,
      name: string
    })),
    maxItems: number,
    seperator: oneOfType([string, node]),
    onCrumbClick: func.isRequired,
    isStream: bool,
    defaultValue: string
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
      defaultValue = 'My File'
    } = this.props;

    const { anchorEl } = this.state;

    const {
      0: firstCrumb,
      [pathList.length - 1]: lastCrumb
    } = pathList;
    const hiddenCrumbs = pathList.slice(1, pathList.length - 1);
    const icon = isStream ? (
      <div className={cx('icon-streams', styles['root-icon'])} />
    ) : <Work className={styles['root-icon']} />;

    return (
      <div className={styles['breadcrumb-container']}>
        <React.Fragment key={'root'}>
          <BreadcrumbItem
            id={'root'}
            icon={icon}
            index={0}
            key={'root'}
            name={pathList.length ? '' : defaultValue}
            onClick={this.onCrumbClick}
          />
        </React.Fragment>
        { !!pathList.length && seperator }
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
                  className={styles['crumb-item']}
                  onClick={this.onSpreadClick}
                >
                  <MoreHoriz className={styles['icon-color']} />
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
