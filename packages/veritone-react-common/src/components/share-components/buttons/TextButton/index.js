import React, { Component } from 'react';
import { string, bool, func, objectOf, any } from 'prop-types';

import classNames from 'classnames';
import styles from './styles.scss';

export default class TextButton extends Component {
  static propTypes = {
    label: string,
    style: objectOf(any),
    className: string,
    highlight: bool,
    onClick: func,
    data: objectOf(any)
  };

  handleOnClick = event => {
    const { onClick, data } = this.props;
    onClick && onClick(event, data);
  };

  render() {
    const { label, style, className, highlight } = this.props;

    return (
      <span
        style={style}
        className={classNames(styles.linkButton, className, {
          [styles.highlight]: highlight
        })}
        onClick={this.handleOnClick}
      >
        {label}
      </span>
    );
  }
}
