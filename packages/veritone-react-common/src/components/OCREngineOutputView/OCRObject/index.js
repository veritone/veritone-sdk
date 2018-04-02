import React, { Component } from 'react';
import { number, string, func } from 'prop-types';
import { isFunction } from 'lodash';

import { msToReadableString } from 'helpers/time';
import styles from './styles.scss';

class OCRObject extends Component {
  static propTypes = {
    text: string,
    startTime: number,
    endTime: number,
    onOcrClicked: func
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
          {msToReadableString(startTime)} - {msToReadableString(endTime)}
        </span>
      </div>
    );
  }
}

export default OCRObject;
