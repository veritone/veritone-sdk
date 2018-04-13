import React, { Component } from 'react';
import { number, string, func, bool } from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

export default class DataSegment extends Component {
  static propTypes = {
    content: string.isRequired,
    startTimeMs: number,
    stopTimeMs: number,
    onClick: func,
    active: bool,
    className: string
  };

  handleOnClick = () => {
    const { startTimeMs, stopTimeMs, onClick } = this.props;
    onClick && onClick(startTimeMs, stopTimeMs);
  };

  render() {
    const { active, content, className, onClick } = this.props;

    return (
      <span
        className={classNames(
          styles.dataSegment,
          className,
          { [styles.highlight]: active },
          { [styles.clickable]: onClick }
        )}
        onClick={this.handleOnClick}
      >
        {content}
      </span>
    );
  }
}
