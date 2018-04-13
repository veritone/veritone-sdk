import React, { Component } from 'react';
import { number, string } from 'prop-types';
import classNames from 'classnames';
import { msToReadableString } from '../../../../helpers/time';

import styles from './styles.scss';

export default class NoDataSegment extends Component {
  static propTypes = {
    startTimeMs: number.isRequired,
    stopTimeMs: number.isRequired,
    description: string,
    className: string,
    timeClassName: string,
    messageClassName: string
  };

  static defaultProps = {
    description: 'No Translation Data Available'
  };

  render() {
    const {
      startTimeMs,
      stopTimeMs,
      description,
      className,
      timeClassName,
      messageClassName
    } = this.props;

    const startTimeString = msToReadableString(startTimeMs);
    const stopTimeString = msToReadableString(stopTimeMs);

    return (
      <div className={classNames(styles.noDataSegment, className)}>
        <div className={classNames(styles.time, timeClassName)}>
          {startTimeString + ' - ' + stopTimeString}
        </div>
        <div className={classNames(styles.message, messageClassName)}>
          {description}
        </div>
      </div>
    );
  }
}
