import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import { get } from 'lodash';
import { format } from 'date-fns';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

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

  componentDidMount() {
    if (this.virtualList) {
      this.virtualList.forceUpdateGrid();
    }
  }

  handleOnClick = (event, seriesObject) => {
    this.props.onClick &&
      this.props.onClick(seriesObject.startTimeMs, seriesObject.stopTimeMs);
  };

  handleDataChanged = (event, historyDiff, cursorPosition) => {
    this.props.onChange && this.props.onChange(event, historyDiff, cursorPosition);
  };

  virtualMeasure = (measure, index) => () => {
    setTimeout(() => { measure && measure() });
    if (this.virtualList) {
      this.virtualList.forceUpdateGrid();
    }
  }

  rowRenderer = editMode => ({ key, parent, index, style }) => {
    const {
      parsedData,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
      selectedCombineViewTypeId,
      cursorPosition,
      clearCursorPosition,
      undo,
      redo,
      setIncomingChanges
    } = this.props;
    const stopMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
    const totalTranscriptSeries = parsedData.snippetSegments
      .reduce((acc, seg) => acc.concat(seg.series), []);
    const totalTranscriptGuidMap = parsedData.snippetSegments
      .reduce((acc, seg) => ({ ...acc, ...seg.wordGuidMap }), {});
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
        rowIndex={index}>
        {({ measure }) => (
          <div style={{ ...style }}>
            <Grid container key={speakerGridKey}>
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
              <Grid item xs sm md lg xl>
                <span className={styles.speakerStartTimeLabel}>
                  {`${speakerTimingStart} - ${speakerTimingStop}`}
                </span>
                {
                  editMode ?
                    (
                      <EditableWrapper
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
                        classNames={classNames(styles.contentSegment)}
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
                        classNames={classNames(styles.contentSegment)}
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

  renderSpeakerSnippetSegments = parsedData => {
    const {
      editMode,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
      selectedCombineViewTypeId,
      cursorPosition,
      clearCursorPosition,
      undo,
      redo,
      setIncomingChanges
    } = this.props;
    const stopMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
    const totalTranscriptSeries = parsedData.snippetSegments
      .reduce((acc, seg) => acc.concat(seg.series), []);
    const totalTranscriptGuidMap = parsedData.snippetSegments
      .reduce((acc, seg) => ({ ...acc, ...seg.wordGuidMap }), {});
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

    if (selectedCombineViewTypeId && selectedCombineViewTypeId.includes('show')) {
      return (
        <List
          ref={ref => this.virtualList = ref}
          key={`virtual-speaker-grid`}
          width={900}
          height={500}
          style={{ width: '100%', height: '100%' }}
          deferredMeasurementCache={cellCache}
          overscanRowCount={5}
          rowRenderer={this.rowRenderer(editMode)}
          rowCount={totalSpeakerSeries.length}
          rowHeight={cellCache.rowHeight} />
      );

      return totalSpeakerSeries.map(speakerSerie => {
        const speakerStartTime = speakerSerie.startTimeMs;
        const speakerStopTime = speakerSerie.stopTimeMs;
        const timeFormat = speakerStartTime >= 3600000 ? 'HH:mm:ss' : 'mm:ss';
        const speakerTimingStart = format(speakerStartTime, timeFormat);
        const speakerTimingStop = format(speakerStopTime, timeFormat);
        const speakerGridKey = `speaker-edit-row-${speakerSerie.guid}`;

        const speakerContent = (
          <Grid container key={speakerGridKey}>
            <Grid item
              xs={4}
              sm={3}
              md={2}
              lg={1}
              xl={1}
            >
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
            <Grid item xs sm md lg xl>
              <span className={styles.speakerStartTimeLabel}>
                {`${speakerTimingStart} - ${speakerTimingStop}`}
              </span>
              {
                editMode ?
                  (
                    <EditableWrapper
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
                      classNames={classNames(styles.contentSegment)}
                      cursorPosition={cursorPosition}
                      clearCursorPosition={clearCursorPosition}
                      setIncomingChanges={setIncomingChanges}
                    />
                  ) :
                  (
                    <SnippetSegment
                      key={'transcript-speaker-snippet' + speakerStartTime}
                      series={speakerSerie.fragments}
                      onClick={this.handleOnClick}
                      startMediaPlayHeadMs={mediaPlayerTimeMs}
                      stopMediaPlayHeadMs={stopMediaPlayHeadMs}
                      classNames={classNames(styles.contentSegment)}
                    />
                  )
              }
            </Grid>
          </Grid>
        );

        return speakerContent;
      });
    } else {
      if (editMode) {
        return (
          <EditableWrapper
            key={'transcript-snippet-editwrapper'}
            content={{
              series: totalTranscriptSeries,
              wordGuidMap: totalTranscriptGuidMap
            }}
            editMode
            onChange={this.handleDataChanged}
            undo={undo}
            redo={redo}
            onClick={this.handleOnClick}
            startMediaPlayHeadMs={mediaPlayerTimeMs}
            stopMediaPlayHeadMs={stopMediaPlayHeadMs}
            classNames={classNames(styles.contentSegment)}
            cursorPosition={cursorPosition}
            clearCursorPosition={clearCursorPosition}
          />
        );
      } else {
        return (
          <SnippetSegment
            key={'transcript-snippet-viewer'}
            series={totalTranscriptSeries}
            onClick={this.handleOnClick}
            startMediaPlayHeadMs={mediaPlayerTimeMs}
            stopMediaPlayHeadMs={stopMediaPlayHeadMs}
            classNames={classNames(styles.contentSegment)}
          />
        );
      }
    }
  };

  render() {
    const {
      parsedData,
      className
    } = this.props;

    return (
      <div className={classNames(styles.transcriptContent, className)}>
        {this.renderSpeakerSnippetSegments(parsedData)}
      </div>
    );
  }
}
