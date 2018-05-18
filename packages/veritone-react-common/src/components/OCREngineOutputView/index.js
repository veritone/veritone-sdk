import React, { Component, Fragment } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import classNames from 'classnames';

import EngineOutputHeader from '../EngineOutputHeader';
import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';
import OCRObject from './OCRObject';
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
        )
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

  handleOcrClick = (startTime, stopTime) => evt => {
    this.props.onOcrClicked && this.props.onOcrClicked(startTime, stopTime);
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
      <div className={classNames(styles.ocrOutputView, className)}>
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
                key={`ocr-object-group-${dataObject.sourceEngineId}-${dataObject.taskId}`}
              >
                {dataObject.status === 'FETCHING' && (
                  <div>Display a progress</div>
                )}
                {dataObject.series && (
                  <span>
                    {dataObject.series.map(ocrObject => {
                      return (
                        <OCRObject
                          key={`ocr-object-${ocrObject.startTimeMs}-${ocrObject.stopTimeMs}-${ocrObject.object.text}`}
                          text={ocrObject.object.text}
                          startTime={ocrObject.startTimeMs}
                          endTime={ocrObject.stopTimeMs}
                          onClick={this.handleOcrClick(
                            ocrObject.startTimeMs,
                            ocrObject.stopTimeMs
                          )}
                          currentMediaPlayerTime={currentMediaPlayerTime}
                        />
                      );
                    })}
                  </span>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}

export default OCREngineOutputView;
