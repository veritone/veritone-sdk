import React, {Component} from 'react';
import classNames from 'classnames';
import { string, number, bool } from 'prop-types';
import { msToReadableString } from '../../../../helpers/time'

import styles from './styles.scss';

export default class NoDataSegment extends Component {
  static propTypes = {
    overview: bool,
    startTimeMs: number,
    stopTimeMs: number,
    className: string,
    timeClassName: string,
    contentClassName: string
  };

  static defaultProps = {
    overview: false,
    startTimeMs: 0,
    stopTimeMs: 0,
  }

  render () {
    let {
      overview,
      startTimeMs,
      stopTimeMs,
      className,
      timeClassName,
      contentClassName
    } = this.props;

    let timeString = msToReadableString(startTimeMs, true);
    if (overview) {
      timeString = timeString + ' - ' + msToReadableString(stopTimeMs, true);
    }

    return (
      <div className={classNames(styles.transcriptNoData, className, {[styles.overview]: overview})}>
        <div className={classNames(styles.time, timeClassName)}>{timeString}</div>
        <div className={classNames(styles.content, contentClassName)}>No Transcript Data Available</div>
      </div>
    );
  }
}