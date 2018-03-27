import React, { Component } from 'react';
import { number, string, func } from 'prop-types';
import { isFunction } from 'lodash';

import styles from './styles.scss';

class OCRObject extends Component {
  static propTypes = {
    text: string,
    startTime: number,
    endTime: number,
    onOcrClicked: func
  };

  msToTime = duration => {
    let h, m, s;
    s = Math.floor(duration / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;

    h = h < 10 && h > 0 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    return (h > 0 ? h + ':' : '') + m + ':' + s;
  };

  handleOcrClick = evt => {
    if (isFunction(this.props.onOcrClicked)) {
      this.props.onOcrClicked(this.props.startTime, this.props.endTime, evt);
    }
  };

  render() {
    let { text, startTime, endTime } = this.props;

    return (
      <div className={styles.ocrContainer} onClick={this.handleOcrClick}>
        <span className={styles.ocrText}>{text}</span>
        <span className={styles.ocrObjectTimestamp}>
          {this.msToTime(startTime)} - {this.msToTime(endTime)}
        </span>
      </div>
    );
  }
}

export default OCRObject;
