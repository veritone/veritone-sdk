import React, { Component, Fragment } from 'react';
import { arrayOf, shape, number, string, func, node } from 'prop-types';
import cx from 'classnames';
import { msToReadableString } from 'helpers/time';
import { isEmpty } from 'lodash';

import Grid from '@material-ui/core/Grid';
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import EngineOutputHeader from '../EngineOutputHeader';
import OCRSegment from './OCRSegment';
import styles from './styles.scss';

const cellCache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true
});
const seriesPerPage = 20;

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

  state = {
    measuredInitially: false
  }

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
  
  onWindowResize = () => {
    if (this.virtualList) {
      this.virtualList.forceUpdateGrid();
    }
  }

  getContentDimension = () => {
    if (this.contentRef) {
      return {
        width: this.contentRef.clientWidth,
        height: this.contentRef.clientHeight
      }
    }
    return {};
  }

  virtualMeasure = (measure, index) => () => {
    const { measuredInitially } = this.state;
    if (!measuredInitially) {
      setTimeout(() => { measure && measure(); });
      this.setState({ measuredInitially: true });
    } else {
      measure && measure();
    }
    if (this.virtualList) {
      this.virtualList.forceUpdateGrid();
    }
  }

  generateVirtualizedSerieBlocks = () => {
    const {
      data
    } = this.props;
    const totalOcrSeries = data.reduce((acc, seg) => acc.concat(seg.series), []);
    const newVirtualizedSerieBlocks = [];

    for (let index = 0, curSeries = []; index < totalOcrSeries.length; index++) {
      const serie = totalOcrSeries[index];
      if (curSeries.length === seriesPerPage || index === totalOcrSeries.length - 1) {
        newVirtualizedSerieBlocks.push({ series: curSeries });
        curSeries = [];
      }
      curSeries.push(serie);
    }
    return newVirtualizedSerieBlocks;
  };

  ocrRowRenderer = ({ key, parent, index, style }) => {
    const {
      className,
      currentMediaPlayerTime,
      onOcrClicked
    } = this.props;

    const virtualizedSerieBlocks = this.generateVirtualizedSerieBlocks();
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
          <div style={{ ...style, width: '100%' }}>
            <OCRSegment
              series={virtualizedSerieBlock.series}
              currentMediaPlayerTime={currentMediaPlayerTime}
              onOcrClicked={onOcrClicked}
              virtualMeasure={this.virtualMeasure}/>
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
      currentMediaPlayerTime,
      outputNullState
    } = this.props;
    const contentDimension = this.getContentDimension();
    const virtualizedSerieBlocks = this.generateVirtualizedSerieBlocks();

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
            ref={ref => this.contentRef = ref}
            className={styles.ocrContent}
            data-veritone-component="orc-engine-output-content"
          >
            <List
              ref={ref => this.virtualList = ref}
              key={`virtual-ocr-grid`}
              width={contentDimension.width || 900}
              height={contentDimension.height || 500}
              style={{ width: '100%', height: '100%' }}
              deferredMeasurementCache={cellCache}
              overscanRowCount={1}
              rowRenderer={this.ocrRowRenderer}
              rowCount={virtualizedSerieBlocks.length}
              rowHeight={cellCache.rowHeight}
            />
          </div>
        )}
      </div>
    );
  }
}



export default OCREngineOutputView;
