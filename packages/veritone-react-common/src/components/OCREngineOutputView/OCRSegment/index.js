import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';

import cx from 'classnames';
import { msToReadableString } from 'helpers/time';
import { isEmpty } from 'lodash';

import styles from './styles.scss';

export default class OCRSegment extends Component {
  static propTypes = {
    series: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        object: shape({
          text: string
        })
      })
    ).isRequired,
    currentMediaPlayerTime: number,
    onOcrClicked: func,
    virtualMeasure: func
  };

  componentDidMount() {
    const { virtualMeasure } = this.props;
    virtualMeasure && virtualMeasure();
  }

  render() {
    const {
      series,
      currentMediaPlayerTime,
      onOcrClicked
    } = this.props;

    return series
      .filter(ocrObject => ocrObject.object && ocrObject.object.text)
      .map(ocrObject => {
        return (
          <div
            key={`ocr-object-${ocrObject.startTimeMs}-${
              ocrObject.stopTimeMs
            }-${ocrObject.object.text}`}
            className={cx(styles.ocrContainer, {
              [styles.highlighted]:
                currentMediaPlayerTime >= ocrObject.startTimeMs &&
                currentMediaPlayerTime <= ocrObject.stopTimeMs
            })}
            // eslint-disable-next-line
            onClick={() => onOcrClicked(ocrObject.startTimeMs, ocrObject.stopTimeMs)}
          >
            <span className={styles.ocrText}>
              {ocrObject.object.text}
            </span>
            {ocrObject.startTimeMs >= 0 &&
              ocrObject.stopTimeMs >= 0 && (
                <span className={styles.ocrObjectTimestamp}>
                  {`${msToReadableString(
                    ocrObject.startTimeMs
                  )} - ${msToReadableString(
                    ocrObject.stopTimeMs
                  )}`}
                </span>
              )}
          </div>
        );
    })
  }
}