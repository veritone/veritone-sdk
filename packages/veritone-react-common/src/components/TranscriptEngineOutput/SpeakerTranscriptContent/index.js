import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import { debounce } from 'lodash';
import { format } from 'date-fns';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import { AutoSizer, List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import SnippetSegment from '../SnippetSegment';
import SpeakerPill from '../SpeakerPill';
import EditableWrapper from '../EditableWrapper';

import styles from './styles.scss';

const cellCache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true
});

export default class SpeakerTranscriptContent extends Component {
  static propTypes = {
    parsedData: shape({
      lazyLoading: bool,
      snippetSegments: arrayOf(shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            guid: string.isRequired,
            words: arrayOf(
              shape({
                word: string.isRequired,
                confidence: number
              })
            )
          })
        )
      })),
      speakerSegments: arrayOf(shape({
        startTimeMs: number,
        stopTimeMs: number,
        status: string,
        series: arrayOf(
          shape({
            guid: string.isRequired,
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            speakerId: string.isRequired,
            fragments: arrayOf(shape({
              startTimeMs: number.isRequired,
              stopTimeMs: number.isRequired,
              guid: string.isRequired,
              words: arrayOf(
                shape({
                  word: string.isRequired,
                  confidence: number
                })
              )
            }))
          })
        )
      }))
    }),
    className: string,

    editMode: bool,

    onClick: func,
    // onScroll: func,
    onChange: func,
    undo: func,
    redo: func,

    // mediaLengthMs: number,
    // neglectableTimeMs: number,
    // estimatedDisplayTimeMs: number,

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number,

    selectedCombineViewTypeId: string,
    cursorPosition: shape({
      start: shape({
        guid: string,
        offset: number
      }),
      end: shape({
        guid: string,
        offset: number
      })
    }),
    clearCursorPosition: func,
    setIncomingChanges: func
  };

  static defaultProps = {
    editMode: false,
    mediaPlayerTimeMs: 0,
    mediaPlayerTimeIntervalMs: 1000
  };

  state = {
    measuredInitially: false
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

  seriesPerPage = 1500;
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

  generateVirtualizedTranscriptBlocks = () => {
    const { parsedData } = this.props;
    const totalTranscriptSeries = parsedData.snippetSegments.reduce((acc, seg) => acc.concat(seg.series), []);
    const totalTranscriptGuidMap = parsedData.snippetSegments.reduce((acc, seg) => ({ ...acc, ...seg.wordGuidMap }), {});
    const newVirtualizedSerieBlocks = [];

    for (let index = 0, curSeries = [], curMap = {}; index < totalTranscriptSeries.length; index++) {
      const serie = totalTranscriptSeries[index];
      if (curSeries.length < this.seriesPerPage) {
        curSeries.push(serie);
        curMap[serie.guid] = totalTranscriptGuidMap[serie.guid];
      } 
      if (curSeries.length === this.seriesPerPage || index === totalTranscriptSeries.length - 1) {
        newVirtualizedSerieBlocks.push({ series: curSeries, wordGuidMap: curMap });
        curSeries = [];
        curMap = {};
      }
    }
    return newVirtualizedSerieBlocks;
  };

  handleOnClick = (event, seriesObject) => {
    this.props.onClick &&
      this.props.onClick(seriesObject.startTimeMs, seriesObject.stopTimeMs);
  };

  handleDataChanged = (event, historyDiff, cursorPosition) => {
    this.props.onChange && this.props.onChange(event, historyDiff, cursorPosition);
  };

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

  transcriptRowRenderer = ({ key, parent, index, style }) => {
    const {
      editMode,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
      cursorPosition,
      clearCursorPosition,
      undo,
      redo,
      setIncomingChanges
    } = this.props;
    const stopMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;

    const virtualizedSerieBlocks = this.generateVirtualizedTranscriptBlocks();
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
            { !editMode
                ? ( 
                  <SnippetSegment
                    className={styles.transcriptView}
                    virtualMeasure={this.virtualMeasure(measure, index)}
                    key={'virtualized-transcript-snippet'}
                    series={virtualizedSerieBlock.series}
                    onClick={this.handleOnClick}
                    startMediaPlayHeadMs={mediaPlayerTimeMs}
                    stopMediaPlayHeadMs={stopMediaPlayHeadMs} />
                ) : (
                  <EditableWrapper
                    seriesPerPage={this.seriesPerPage}
                    virtualMeasure={this.virtualMeasure(measure, index)}
                    key={'virtualized-transcript-snippet-editwrapper'}
                    content={{
                      series: virtualizedSerieBlock.series,
                      wordGuidMap: virtualizedSerieBlock.wordGuidMap
                    }}
                    editMode
                    onChange={this.handleDataChanged}
                    undo={undo}
                    redo={redo}
                    onClick={this.handleOnClick}
                    startMediaPlayHeadMs={mediaPlayerTimeMs}
                    stopMediaPlayHeadMs={stopMediaPlayHeadMs}
                    cursorPosition={cursorPosition}
                    clearCursorPosition={clearCursorPosition}
                    setIncomingChanges={setIncomingChanges} />
                )
            }
          </div>
        )}
      </CellMeasurer>
    );
  }

  speakerRowRenderer = editMode => ({ key, parent, index, style }) => {
    const {
      parsedData,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
      cursorPosition,
      clearCursorPosition,
      undo,
      redo,
      setIncomingChanges
    } = this.props;
    const stopMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
    const totalSpeakerSeries = parsedData.speakerSegments
      .reduce((acc, seg) => acc.concat(seg.series), []);
    const availableSpeakerSet = new Set();
    totalSpeakerSeries.forEach(serie => {
      serie.speakerId && availableSpeakerSet.add(serie.speakerId);
    });
    const availableSpeakers = Array.from(availableSpeakerSet);
    availableSpeakers.sort((a, b) => {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

      
    const startZeroTime = new Date(1990, 8, 15);
    const stopZeroTime = new Date(1990, 8, 15);
    const speakerSerie = totalSpeakerSeries[index];
    startZeroTime.setMilliseconds(speakerSerie.startTimeMs);
    stopZeroTime.setMilliseconds(speakerSerie.stopTimeMs);
    const speakerStartTime = startZeroTime.getTime();
    const speakerStopTime = stopZeroTime.getTime();
    const timeFormat = speakerSerie.startTimeMs >= 3600000 ? 'HH:mm:ss' : 'mm:ss';
    const speakerTimingStart = format(speakerStartTime, timeFormat);
    const speakerTimingStop = format(speakerStopTime, timeFormat);
    const speakerGridKey = `speaker-edit-row-${speakerSerie.guid}`;

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
            <Grid container key={speakerGridKey} style={{ height: '100%', paddingBottom: '20px' }}>
              <Grid item xs={4} sm={3} md={2} lg={1} xl={1}>
                <SpeakerPill
                  editMode={editMode}
                  speakerSegment={speakerSerie}
                  speakerData={parsedData.speakerSegments}
                  availableSpeakers={availableSpeakers}
                  onClick={this.handleOnClick}
                  onChange={this.handleDataChanged}
                  startMediaPlayHeadMs={mediaPlayerTimeMs}
                  stopMediaPlayHeadMs={stopMediaPlayHeadMs}
                />
              </Grid>
              <Grid item xs sm md lg xl style={{ height: '100%' }}>
                <span className={styles.speakerStartTimeLabel}>
                  {`${speakerTimingStart} - ${speakerTimingStop}`}
                </span>
                {
                  editMode ?
                    (
                      <EditableWrapper
                        seriesPerPage={this.seriesPerPage}
                        virtualMeasure={this.virtualMeasure(measure, index)}
                        key={'transcript-speaker-snippet' + speakerStartTime}
                        speakerData={parsedData.speakerSegments}
                        content={{
                          series: speakerSerie.fragments,
                          wordGuidMap: speakerSerie.wordGuidMap
                        }}
                        editMode
                        onChange={this.handleDataChanged}
                        undo={undo}
                        redo={redo}
                        onClick={this.handleOnClick}
                        startMediaPlayHeadMs={mediaPlayerTimeMs}
                        stopMediaPlayHeadMs={stopMediaPlayHeadMs}
                        cursorPosition={cursorPosition}
                        clearCursorPosition={clearCursorPosition}
                        setIncomingChanges={setIncomingChanges}
                      />
                    ) :
                    (
                      <SnippetSegment
                        virtualMeasure={this.virtualMeasure(measure, index)}
                        key={'transcript-speaker-snippet' + speakerStartTime}
                        series={speakerSerie.fragments}
                        onClick={this.handleOnClick}
                        startMediaPlayHeadMs={mediaPlayerTimeMs}
                        stopMediaPlayHeadMs={stopMediaPlayHeadMs}
                      />
                    )
                }
              </Grid>
            </Grid>
          </div>
        )}
      </CellMeasurer>
    );
  }

  render() {
    const {
      parsedData,
      className,
      editMode,
      selectedCombineViewTypeId
    } = this.props;
    const virtualizedSerieBlocks = this.generateVirtualizedTranscriptBlocks();
    const totalSpeakerSeries = parsedData.speakerSegments
      .reduce((acc, seg) => acc.concat(seg.series), []);
    const availableSpeakerSet = new Set();
    totalSpeakerSeries.forEach(serie => {
      serie.speakerId && availableSpeakerSet.add(serie.speakerId);
    });
    const availableSpeakers = Array.from(availableSpeakerSet);
    availableSpeakers.sort((a, b) => {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

    return (
      <div className={classNames(styles.transcriptContent, className)}>
        <AutoSizer style={{ width: '100%', height: '100%' }}>
          {({ height, width }) => {
            return selectedCombineViewTypeId && selectedCombineViewTypeId.includes('show')
            ? (
              <List
                // eslint-disable-next-line
                ref={ref => this.virtualList = ref}
                key={`virtual-speaker-grid`}
                width={width || 900}
                height={height || 500}
                style={{ width: '100%', height: '100%' }}
                deferredMeasurementCache={cellCache}
                overscanRowCount={5}
                rowRenderer={this.speakerRowRenderer(editMode)}
                rowCount={totalSpeakerSeries.length}
                rowHeight={cellCache.rowHeight} /> 
            ) : (
              <List
                // eslint-disable-next-line
                ref={ref => this.virtualList = ref}
                key={`virtual-transcript-grid`}
                width={width || 900}
                height={height || 500}
                style={{ width: '100%', height: '100%' }}
                deferredMeasurementCache={cellCache}
                overscanRowCount={1}
                rowRenderer={this.transcriptRowRenderer}
                rowCount={virtualizedSerieBlocks.length}
                rowHeight={cellCache.rowHeight}
              />
            )
          }}
        </AutoSizer>
      </div>
    );
  }
}
