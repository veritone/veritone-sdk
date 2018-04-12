import React, { Component } from 'react';
import { number, string } from 'prop-types';
import classNames from 'classnames';
import { msToReadableString } from '../../../../helpers/time';

import styles from './styles.scss';

export default class NoDataSegment extends Component {
  static propTypes = {
    startTimeMs: number,
    stopTimeMs: number,
    className: string,
    timeClassName: string,
    messageClassName: string
  };

  render() {
    let {
      startTimeMs,
      stopTimeMs,
      className,
      timeClassName,
      messageClassName
    } = this.props;

    let startTimeString = msToReadableString(startTimeMs);
    let stopTimeString = msToReadableString(stopTimeMs);

    return (
      <div className={classNames(styles.noDataSegment, className)}>
        <div className={classNames(styles.time, timeClassName)}>
          {startTimeString + ' - ' + stopTimeString}
        </div>
        <div className={classNames(styles.message, messageClassName)}>
          No Translation Data Available
        </div>
      </div>
    );
  }
}
