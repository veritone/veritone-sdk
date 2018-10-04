import React from 'react';
import cx from 'classnames';
import { bool, node, string, func, number } from 'prop-types';
import { noop } from 'lodash';

import styles from './styles.scss';

export default class DualStateIcon extends React.Component {
  static propTypes = {
    isActive: bool,
    children: node.isRequired,
    caption: string,
    activeClass: string,
    inActiveClass: string,
    onClick: func,
    size: number
  };

  static defaultProps = {
    isActive: false,
    size: 40,
    onClick: noop
  };

  state = {
    active: this.props.isActive
  };

  toggleState = () => {
    this.setState(
      prevState => ({
        active: !prevState.active
      }),
      () => {
        this.props.onClick(this.state.active);
      }
    );
  };

  render() {
    const { children } = this.props;
    const avatarClass = this.state.active
      ? this.props.activeClass
      : this.props.inActiveClass;
    const { style, className, ...rest } = children.props;

    return (
      children && (
        <div className={styles['dsi-container']}>
          <div className="dsi-icon" onClick={this.toggleState}>
            {React.cloneElement(children, {
              style: {
                cursor: 'pointer',
                fontSize: this.props.size,
                ...style
              },
              className: cx(avatarClass, className),
              ...rest.props
            })}
          </div>
          {this.props.caption && (
            <span className={styles['dsi-caption']}>{this.props.caption}</span>
          )}
        </div>
      )
    );
  }
}
