import React, { Component } from 'react';
import { arrayOf, shape, number, string, func, node } from 'prop-types';
import cx from 'classnames';
import { msToReadableString } from 'helpers/time';
import { chunk } from 'lodash';
import {
  AutoSizer,
  List as VirtualizedList,
  CellMeasurer,
  CellMeasurerCache
} from 'react-virtualized';
import Grid from '@material-ui/core/Grid';

import EngineOutputHeader from '../EngineOutputHeader';
import styles from './styles.scss';

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
    currentMediaPlayerTime: number,
    outputNullState: node
  };

  static defaultProps = {
    data: []
  };

  _cache = new CellMeasurerCache({
    defaultHeight: 1000,
    minHeight: 50,
    fixedWidth: true
  });

  _rowRenderer = ocrData => ({
    index,
    isScrolling,
    isVisible,
    key,
    parent,
    style
  }) => {
    const { onOcrClicked, currentMediaPlayerTime } = this.props;
    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <Grid container style={style}>
          {ocrData[index].map(ocrObject => {
            const ocrKey =
              ocrObject.guid ||
              `ocr-object-${ocrObject.startTimeMs}-${ocrObject.stopTimeMs}-${
                ocrObject.object.text
              }`;
            return (
              <div
                key={ocrKey}
                className={cx(styles.ocrContainer, {
                  [styles.highlighted]:
                    currentMediaPlayerTime >= ocrObject.startTimeMs &&
                    currentMediaPlayerTime <= ocrObject.stopTimeMs
                })}
                // eslint-disable-next-line
                onClick={() =>
                  onOcrClicked(ocrObject.startTimeMs, ocrObject.stopTimeMs)
                }
              >
                <span className={styles.ocrText}>{ocrObject.object.text}</span>
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
        </Grid>
      </CellMeasurer>
    );
  };

  handleResize = () => {
    this._cache.clearAll();
  };

  render() {
    const {
      data,
      className,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClick,
      outputNullState
    } = this.props;

    let ocrs = data.reduce((acc, datum) => {
      return acc.concat(datum.series);
    }, []);

    // VTN-13255 - for a large number of image results split the list into
    // chunks so that we can virtualize the to improve performance. We may need
    // to play with the values to see what works best.
    ocrs = chunk(ocrs, ocrs.length > 5000 ? 200 : ocrs.length);

    return (
      <div className={cx(styles.ocrOutputView, className)}>
        <EngineOutputHeader
          title="Text Recognition"
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClick={onExpandClick}
        />
        {outputNullState || (
          <div className={styles.ocrContent}>
            <AutoSizer onResize={this.handleResize}>
              {({ width, height }) => {
                return (
                  <VirtualizedList
                    height={height}
                    rowHeight={this._cache.rowHeight}
                    rowCount={ocrs.length}
                    rowRenderer={this._rowRenderer(ocrs)}
                    width={width}
                    deferredMeasurementCache={this._cache}
                    overscanRowCount={5}
                  />
                );
              }}
            </AutoSizer>
          </div>
        )}
      </div>
    );
  }
}

export default OCREngineOutputView;
