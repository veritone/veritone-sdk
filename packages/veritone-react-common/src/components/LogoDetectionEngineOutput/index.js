import React, { Component } from 'react';
import { arrayOf, number, string, func, shape, node } from 'prop-types';
import classNames from 'classnames';
import { debounce } from 'lodash';

import {
  AutoSizer,
  List,
  CellMeasurer,
  CellMeasurerCache
} from 'react-virtualized';

import EngineOutputHeader from '../EngineOutputHeader';
import LogoSegment from './LogoSegment';

import styles from './styles.scss';

const cellCache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true
});

export default class LogoDetectionEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(
          shape({
            startTimeMs: number,
            stopTimeMs: number,
            object: shape({
              label: string,
              confidence: number
            })
          })
        )
      })
    ), // series data

    title: string,
    engines: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    selectedEngineId: string,

    className: string,

    onEntrySelected: func,
    onEngineChange: func,
    onExpandClick: func,

    currentMediaPlayerTime: number,
    outputNullState: node
  };

  static defaultProps = {
    data: [],
    title: 'Logo Recognition',
    currentMediaPlayerTime: 0
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

  handleEntrySelected = (event, entry) => {
    this.props.onEntrySelected &&
      this.props.onEntrySelected(entry.startTimeMs, entry.stopTimeMs);
  };

  generateVirtualizedLogoBlocks = () => {
    const { data } = this.props;
    const totalLogoSeries = data.reduce(
      (acc, seg) => acc.concat(seg.series),
      []
    );
    const newVirtualizedSerieBlocks = [];

    for (
      let index = 0, curSeries = [];
      index < totalLogoSeries.length;
      index++
    ) {
      const serie = totalLogoSeries[index];
      if (curSeries.length < this.seriesPerPage) {
        curSeries.push(serie);
      }
      if (
        curSeries.length === this.seriesPerPage ||
        index === totalLogoSeries.length - 1
      ) {
        newVirtualizedSerieBlocks.push({ series: curSeries });
        curSeries = [];
      }
    }
    return newVirtualizedSerieBlocks;
  };

  logoRowRenderer = ({ key, parent, index, style }) => {
    const { currentMediaPlayerTime, onEntrySelected } = this.props;

    const virtualizedSerieBlocks = this.generateVirtualizedLogoBlocks();
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
            className={`logo-segment-block-${index}`}
            style={{ ...style, width: '100%' }}
          >
            <LogoSegment
              virtualMeasure={this.virtualMeasure(measure, index)}
              series={virtualizedSerieBlock.series}
              currentMediaPlayerTime={currentMediaPlayerTime}
              onEntrySelected={onEntrySelected}
            />
          </div>
        )}
      </CellMeasurer>
    );
  };

  render() {
    const {
      title,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClick,
      outputNullState
    } = this.props;
    const virtualizedSerieBlocks = this.generateVirtualizedLogoBlocks();

    return (
      <div className={classNames(styles.logoDetection, this.props.className)}>
        <EngineOutputHeader
          title={title}
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClick={onExpandClick}
        />
        {outputNullState || (
          <div
            className={styles.logoContent}
            data-veritone-component="logo-engine-output-content"
          >
            <AutoSizer style={{ width: '100%', height: '100%' }}>
              {({ height, width }) => (
                <List
                  // eslint-disable-next-line
                  ref={ref => (this.virtualList = ref)}
                  className={'virtual-logo-list'}
                  key={`virtual-logo-grid`}
                  width={width || 900}
                  height={height || 500}
                  style={{ width: '100%', height: '100%' }}
                  deferredMeasurementCache={cellCache}
                  overscanRowCount={1}
                  rowRenderer={this.logoRowRenderer}
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
