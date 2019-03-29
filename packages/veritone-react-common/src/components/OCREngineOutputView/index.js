import React, { Component } from 'react';
import { arrayOf, shape, number, string, func, node } from 'prop-types';
import cx from 'classnames';
import { debounce } from 'lodash';

import { AutoSizer, List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import EngineOutputHeader from '../EngineOutputHeader';
import OCRSegment from './OCRSegment';
import styles from './styles.scss';

const cellCache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true
});

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

  componentDidMount() {
    if (this.virtualList) {
      this.virtualList.forceUpdateGrid();
    }
    // Create resize watchers to calculate width available for text
    window.addEventListener('resize', this.onWindowResize);
    setTimeout(this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  seriesPerPage = 20;
  windowResizeDelay = 100;
  
  onWindowResize = debounce(
    () => this.handleWindowResize(),
    this.windowResizeDelay
  );

  handleWindowResize = () => {
    if (this.virtualList) {
      cellCache.clearAll();
      this.virtualList.forceUpdateGrid();
    }
  }

  virtualMeasure = (measure, index) => () => {
    measure && measure();
    if (this.virtualList) {
      this.virtualList.forceUpdateGrid();
    }
  }

  generateVirtualizedOcrBlocks = () => {
    const {
      data
    } = this.props;
    const totalOcrSeries = data.reduce((acc, seg) => acc.concat(seg.series), []);
    const newVirtualizedSerieBlocks = [];

    for (let index = 0, curSeries = []; index < totalOcrSeries.length; index++) {
      const serie = totalOcrSeries[index];
      if (curSeries.length < this.seriesPerPage) {
        curSeries.push(serie);
      }
      if (curSeries.length === this.seriesPerPage || index === totalOcrSeries.length - 1) {
        newVirtualizedSerieBlocks.push({ series: curSeries });
        curSeries = [];
      }
    }
    return newVirtualizedSerieBlocks;
  };

  ocrRowRenderer = ({ key, parent, index, style }) => {
    const {
      currentMediaPlayerTime,
      onOcrClicked
    } = this.props;

    const virtualizedSerieBlocks = this.generateVirtualizedOcrBlocks();
    const virtualizedSerieBlock = virtualizedSerieBlocks[index];

    return (
      <CellMeasurer
        key={key}
        parent={parent}
        cache={cellCache}
        columnIndex={0}
        style={{ width: '100%' }}
        rowIndex={index}>
        {({ measure }) => (
          <div className={`ocr-segment-block-${index}`} style={{ ...style, width: '100%' }}>
            <OCRSegment
              virtualMeasure={this.virtualMeasure(measure, index)}
              series={virtualizedSerieBlock.series}
              currentMediaPlayerTime={currentMediaPlayerTime}
              onOcrClicked={onOcrClicked} />
          </div>
        )}
      </CellMeasurer>
    );
  }

  render() {
    const {
      className,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClick,
      outputNullState
    } = this.props;
    const virtualizedSerieBlocks = this.generateVirtualizedOcrBlocks();

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
          <div 
            className={styles.ocrContent}
            data-veritone-component="orc-engine-output-content"
          >
            <AutoSizer style={{ width: '100%', height: '100%' }}>
              {({ height, width }) => (
                <List
                  // eslint-disable-next-line
                  ref={ref => this.virtualList = ref}
                  className={'virtual-ocr-list'}
                  key={`virtual-ocr-grid`}
                  width={width || 900}
                  height={height || 500}
                  style={{ width: '100%', height: '100%' }}
                  deferredMeasurementCache={cellCache}
                  overscanRowCount={1}
                  rowRenderer={this.ocrRowRenderer}
                  rowCount={virtualizedSerieBlocks.length}
                  rowHeight={cellCache.rowHeight}
                />
              )}
            </AutoSizer>
          </div>
        )}
      </div>
    );
  }
}



export default OCREngineOutputView;
