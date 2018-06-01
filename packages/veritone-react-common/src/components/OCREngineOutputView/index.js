import React, { Component, Fragment } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import cx from 'classnames';
import { msToReadableString } from 'helpers/time';
import { isEmpty } from 'lodash';

import EngineOutputHeader from '../EngineOutputHeader';
import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';
import styles from './styles.scss';

@withMuiThemeProvider
class OCREngineOutputView extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        sourceEngineId: string,
        sourceEngineName: string,
        taskId: string,
        series: arrayOf(
          shape({
            startTimeMs: number,
            stopTimeMs: number,
            object: shape({
              text: string
            })
          })
        ).isRequired
      })
    ),
    engines: arrayOf(
      shape({
        sourceEngineId: string,
        sourceEngineName: string
      })
    ),
    selectedEngineId: string,
    onEngineChange: func,
    onExpandClick: func,
    onOcrClicked: func,
    className: string,
    currentMediaPlayerTime: number
  };

  static defaultProps = {
    data: []
  };

  render() {
    const {
      data,
      className,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClick,
      currentMediaPlayerTime
    } = this.props;

    return (
      <div className={cx(styles.ocrOutputView, className)}>
        <EngineOutputHeader
          title="Text Recognition"
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClick={onExpandClick}
        />
        <div className={styles.ocrContent}>
          {data.map(dataObject => {
            return (
              <Fragment
                key={`ocr-object-group-${dataObject.sourceEngineId}-${
                  dataObject.taskId
                }`}
              >
                {dataObject.status === 'FETCHING' && (
                  <div>Display a progress</div>
                )}
                {!isEmpty(dataObject.series) &&
                  dataObject.series.map(ocrObject => {
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
                        onClick={() =>
                          // eslint-disable-line
                          this.props.onOcrClicked(
                            ocrObject.startTimeMs,
                            ocrObject.stopTimeMs
                          )
                        }
                      >
                        <span className={styles.ocrText}>
                          {ocrObject.object.text}
                        </span>
                        {ocrObject.startTimeMs >= 0 &&
                          ocrObject.stopTimeMs >= 0 && (
                            <span className={styles.ocrObjectTimestamp}>
                              {`${msToReadableString(
                                ocrObject.startTimeMs
                              )} - ${msToReadableString(ocrObject.stopTimeMs)}`}
                            </span>
                          )}
                      </div>
                    );
                  })}
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}

export default OCREngineOutputView;
