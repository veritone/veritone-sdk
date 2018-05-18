import React, { Component } from 'react';
import { number, string, func } from 'prop-types';
import cx from 'classnames';

import { msToReadableString } from 'helpers/time';
import styles from './styles.scss';

class OCRObject extends Component {
  static propTypes = {
    text: string.isRequired,
    startTime: number.isRequired,
    endTime: number.isRequired,
    onClick: func,
    currentMediaPlayerTime: number
  };

  render() {
    const {
      text,
      startTime,
      endTime,
      onClick,
      currentMediaPlayerTime
    } = this.props;

    const highlightOcr =
      currentMediaPlayerTime >= startTime && currentMediaPlayerTime <= endTime;

    return (
      <div
        className={cx(styles.ocrContainer, {
          [styles.highlighted]: highlightOcr
        })}
        onClick={onClick}
      >
        <span className={styles.ocrText}>{text}</span>
        <span className={styles.ocrObjectTimestamp}>
          {msToReadableString(startTime)} - {msToReadableString(endTime)}
        </span>
      </div>
    );
  }
}

export default OCRObject;
