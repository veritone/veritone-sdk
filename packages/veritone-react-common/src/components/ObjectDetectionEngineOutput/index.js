import React, { Component } from 'react';
import { arrayOf, shape, number, string, func, node } from 'prop-types';
import classNames from 'classnames';
import { debounce } from 'lodash';

import {
  AutoSizer,
  List,
  CellMeasurer,
  CellMeasurerCache
} from 'react-virtualized';

import EngineOutputHeader from '../EngineOutputHeader';
import ObjectGroup from './ObjectGroup';

import styles from './styles.scss';

const cellCache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true
});

class ObjectDetectionEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            object: shape({
              label: string.isRequired,
              confidence: number
            }).isRequired
          })
        )
      })
    ),
    onObjectClick: func,
    selectedEngineId: string,
    engines: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    onEngineChange: func,
    className: string,
    currentMediaPlayerTime: number,
    onExpandClick: func,
    outputNullState: node
  };

  static defaultProps = {
    data: [],
    engines: []
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
  };

  virtualMeasure = (measure, index) => () => {
    measure && measure();
    if (this.virtualList) {
      this.virtualList.forceUpdateGrid();
    }
  };

  generateVirtualizedObjectBlocks = () => {
    const { data } = this.props;
    const totalObjectSeries = data.reduce(
      (acc, seg) => acc.concat(seg.series),
      []
    );
    const newVirtualizedSerieBlocks = [];

    for (
      let index = 0, curSeries = [];
      index < totalObjectSeries.length;
      index++
    ) {
      const serie = totalObjectSeries[index];
      if (curSeries.length < this.seriesPerPage) {
        curSeries.push(serie);
      }
      if (
        curSeries.length === this.seriesPerPage ||
        index === totalObjectSeries.length - 1
      ) {
        newVirtualizedSerieBlocks.push({ series: curSeries });
        curSeries = [];
      }
    }
    return newVirtualizedSerieBlocks;
  };

  objectRowRenderer = ({ key, parent, index, style }) => {
    const { currentMediaPlayerTime, onObjectClick } = this.props;

    const virtualizedSerieBlocks = this.generateVirtualizedObjectBlocks();
    const virtualizedSerieBlock = virtualizedSerieBlocks[index];

    return (
      <CellMeasurer
        key={key}
        parent={parent}
        cache={cellCache}
        columnIndex={0}
        style={{ width: '100%' }}
        rowIndex={index}
      >
        {({ measure }) => (
          <div
            className={`object-segment-block-${index}`}
            style={{ ...style, width: '100%' }}
          >
            <ObjectGroup
              virtualMeasure={this.virtualMeasure(measure, index)}
              objectGroup={virtualizedSerieBlock}
              currentMediaPlayerTime={currentMediaPlayerTime}
              onObjectClick={onObjectClick}
            />
          </div>
        )}
      </CellMeasurer>
    );
  };

  render() {
    const {
      className,
      selectedEngineId,
      engines,
      onEngineChange,
      onExpandClick,
      outputNullState
    } = this.props;
    const virtualizedSerieBlocks = this.generateVirtualizedObjectBlocks();

    return (
      <div className={classNames(styles.objectDetectionOutputView, className)}>
        <EngineOutputHeader
          title="Object Detection"
          onExpandClick={onExpandClick}
          onEngineChange={onEngineChange}
          selectedEngineId={selectedEngineId}
          engines={engines}
        />
        {outputNullState || (
          <div
            className={styles.objectDetectionContent}
            data-veritone-component="object-detection-output-content"
          >
            <AutoSizer style={{ width: '100%', height: '100%' }}>
              {({ height, width }) => (
                <List
                  // eslint-disable-next-line
                  ref={ref => (this.virtualList = ref)}
                  className={'virtual-object-list'}
                  key={`virtual-object-grid`}
                  width={width || 900}
                  height={height || 500}
                  style={{ width: '100%', height: '100%' }}
                  deferredMeasurementCache={cellCache}
                  overscanRowCount={1}
                  rowRenderer={this.objectRowRenderer}
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

export default ObjectDetectionEngineOutput;
