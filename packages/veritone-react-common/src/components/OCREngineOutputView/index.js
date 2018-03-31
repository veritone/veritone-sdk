import React, { Component } from 'react';
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
        endTimeMs: number,
        sourceEngineId: string,
        sourceEngineName: string,
        taskId: string,
        series: arrayOf(
          shape({
            end: number,
            start: number,
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
    onExpandClicked: func,
    onOcrClicked: func,
    className: string
  };

  static defaultProps = {
    assets: []
  };

  render() {
    let {
      data,
      className,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClicked
    } = this.props;

    return (
      <div className={classNames(styles.ocrOutputView, className)}>
        <EngineOutputHeader
          title="Text Recognition"
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClicked={onExpandClicked}
        />
        <div className={styles.ocrContent}>
          {data
            .reduce((accumulator, currentValue) => {
              return [...accumulator, ...currentValue.series];
            }, [])
            .map((ocrObject, i) => {
              return (
                <OCRObject
                  key={i}
                  text={ocrObject.object.text}
                  startTime={ocrObject.start}
                  endTime={ocrObject.end}
                />
              );
            })}
        </div>
      </div>
    );
  }
}

export default OCREngineOutputView;
