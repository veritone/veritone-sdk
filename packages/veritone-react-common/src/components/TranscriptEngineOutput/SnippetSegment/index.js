import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import { orderBy, get } from 'lodash';
import classNames from 'classnames';
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import SnippetFragment from '../SnippetFragment';

import styles from './styles.scss';

const cellCache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true
});

export default class SnippetSegment extends Component {
  static propTypes = {
    series: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        value: string
      })
    ),
    className: string,
    contentClassName: string,
    onClick: func,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number,
    virtualMeasure: func
  };

  static defaultProps = {
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

  state = {
    virtualizedSerieBlocks: []
  }

  componentDidMount() {
    const { virtualMeasure } = this.props;
    virtualMeasure && virtualMeasure();

    // Create resize watchers to calculate width available for text
    window.addEventListener('resize', this.onWindowResize);
    setTimeout(this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    const {
      series,
      getContainerDimension
    } = this.props;
    const containerDimension = getContainerDimension && getContainerDimension();
    const newVirtualizedSerieBlocks = [];
    const charPerPage = 2813;

    for (let index = 0, charCount = 0, curSeries = []; index < series.length; index++) {
      const serie = series[index];
      charCount += serie.words[0].word.length;
      if (charCount > charPerPage || index === series.length - 1) {
        charCount = 0;
        newVirtualizedSerieBlocks.push({ series: curSeries });
        curSeries = [];
      }
      curSeries.push(serie);
    }
    this.setState({ virtualizedSerieBlocks: newVirtualizedSerieBlocks }, () => {
      if (this.virtualList) {
        this.virtualList.forceUpdateGrid();
      }
    });
  }

  handleSnippetClick = entryData => event => {
    const { onClick } = this.props;

    if (onClick) {
      onClick(event, entryData);
    }
  };

  rowRenderer = ({ key, parent, index, style }) => {
    const {
      className,
      series,
      contentClassName,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;
    const {
      virtualizedSerieBlocks
    } = this.state;
    const textareaToDecodeCharacters = document.createElement('textarea');

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
            {
              virtualizedSerieBlock.series.map(entry => {
                const startTime = entry.startTimeMs;
                const stopTime = entry.stopTimeMs;
                const words = entry.words || [];
                const orderedWords = orderBy(words, ['confidence'], ['desc']);
                const selectedWord = get(orderedWords, '[0].word');
                const fragmentKey = entry.guid
                  ? entry.guid
                  : `snippet-fragment-${startTime}-${stopTime}-${value.substr(0, 32)}`;
                let value = '';
                if (selectedWord) {
                  textareaToDecodeCharacters.innerHTML = selectedWord;
                  value = textareaToDecodeCharacters.value;
                }

                return (
                  <SnippetFragment
                    key={fragmentKey}
                    value={value}
                    active={
                      !(
                        stopMediaPlayHeadMs < startTime || startMediaPlayHeadMs > stopTime
                      )
                    }
                    startTimeMs={startTime}
                    stopTimeMs={stopTime}
                    onClick={this.handleSnippetClick(entry)}
                  />
                );
              })
            }
          </div>
        )}
      </CellMeasurer>
    );
  }

  render() {
    const {
      className,
      series,
      contentClassName,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;
    const {
      virtualizedSerieBlocks
    } = this.state;
    const textareaToDecodeCharacters = document.createElement('textarea');

    return (
      <div className={classNames(styles.transcriptSegment, className)}>
        <div className={classNames(styles.content, contentClassName)}>
          <List
            ref={ref => this.virtualList = ref}
            key={`virtual-transcript-grid`}
            width={900}
            height={500}
            style={{ width: '100%', height: '100%' }}
            deferredMeasurementCache={cellCache}
            overscanRowCount={1}
            rowRenderer={this.rowRenderer}
            rowCount={virtualizedSerieBlocks.length}
            rowHeight={cellCache.rowHeight} />
        </div>
      </div>
    );

    return (
      <div className={classNames(styles.transcriptSegment, className)}>
        <div className={classNames(styles.content, contentClassName)}>
          {
            series.map(entry => {
              const startTime = entry.startTimeMs;
              const stopTime = entry.stopTimeMs;
              const words = entry.words || [];
              const orderedWords = orderBy(words, ['confidence'], ['desc']);
              const selectedWord = get(orderedWords, '[0].word');
              const fragmentKey = entry.guid
                ? entry.guid
                : `snippet-fragment-${startTime}-${stopTime}-${value.substr(0, 32)}`;
              let value = '';
              if (selectedWord) {
                textareaToDecodeCharacters.innerHTML = selectedWord;
                value = textareaToDecodeCharacters.value;
              }

              return (
                <SnippetFragment
                  key={fragmentKey}
                  value={value}
                  active={
                    !(
                      stopMediaPlayHeadMs < startTime || startMediaPlayHeadMs > stopTime
                    )
                  }
                  startTimeMs={startTime}
                  stopTimeMs={stopTime}
                  onClick={this.handleSnippetClick(entry)}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}
