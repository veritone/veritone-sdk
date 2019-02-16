import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import { isArray } from 'lodash';
import { format } from 'date-fns';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';

import DynamicContentScroll from '../../share-components/scrolls/DynamicContentScroll';
import SnippetSegment from '../SnippetSegment';
import SpeakerPill from '../SpeakerPill';
import EditableWrapper from '../EditableWrapper';

import styles from './styles.scss';

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
    onScroll: func,
    onChange: func,
    undo: func,
    redo: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMs: number,

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
    clearCursorPosition: func
  };

  static defaultProps = {
    editMode: false,
    mediaPlayerTimeMs: 0,
    mediaPlayerTimeIntervalMs: 1000
  };

  handleOnClick = (event, seriesObject) => {
    this.props.onClick &&
      this.props.onClick(seriesObject.startTimeMs, seriesObject.stopTimeMs);
  };

  handleDataChanged = (event, historyDiff, cursorPosition) => {
    this.props.onChange && this.props.onChange(event, historyDiff, cursorPosition);
  };

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
    } = this.props;
    const speakerData = parsedData.speakerSegments;

    const availableSpeakerSet = new Set();
    isArray(speakerData) && speakerData.forEach((chunk, chunkIndex) => {
      isArray(chunk.series) && chunk.series.forEach((serie, index) => {
        availableSpeakerSet.add(serie.speakerId);
      });
    });
    const availableSpeakers = Array.from(availableSpeakerSet);
    availableSpeakers.sort((a, b) => {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

    const stopMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
    const speakerSegments = parsedData.speakerSegments;


    if (selectedCombineViewTypeId === 'speaker-view') {
      const speakerSnippetSegments = speakerSegments.map((speakerSegment, speakerChunkIndex) => {
        const speakerSeries = speakerSegment.series.map((speakerSerie, speakerIndex) => {
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
                  speakerIndex={speakerIndex}
                  editMode={editMode}
                  speakerSegment={speakerSerie}
                  speakerData={speakerSegments}
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
                        speakerData={speakerData}
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

        return {
          start: speakerSegment.startTimeMs,
          stop: speakerSegment.stopTimeMs,
          content: speakerSeries
        };
      });

      return speakerSnippetSegments;
    } else {
      if (editMode) {
        const snippetSegments = parsedData.snippetSegments.map((segmentData, chunkIndex) => {
          const segmentStartTime = segmentData.startTimeMs;
          const segmentStopTime = segmentData.stopTimeMs;
          const segmentContent = (
            <EditableWrapper
              key={'transcript-snippet' + segmentStartTime}
              content={segmentData}
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

          return {
            start: segmentStartTime,
            stop: segmentStopTime,
            content: segmentContent
          };
        });

        return snippetSegments;
      } else {
        const snippetSegments = parsedData.snippetSegments.map(segmentData => {
          const segmentStartTime = segmentData.startTimeMs;
          const segmentStopTime = segmentData.stopTimeMs;
          const segmentContent = (
            <SnippetSegment
              key={'transcript-snippet' + segmentStartTime}
              series={segmentData.series}
              onClick={this.handleOnClick}
              startMediaPlayHeadMs={mediaPlayerTimeMs}
              stopMediaPlayHeadMs={stopMediaPlayHeadMs}
              classNames={classNames(styles.contentSegment)}
            />
          );

          return {
            start: segmentStartTime,
            stop: segmentStopTime,
            content: segmentContent
          };
        });

        return snippetSegments;
      }
    }
  };

  render() {
    const {
      parsedData,
      editMode,
      className,
      mediaLengthMs,
      neglectableTimeMs,
      estimatedDisplayTimeMs,
      onScroll
    } = this.props;

    return (
      <div className={classNames(styles.transcriptContent, className)}>
        <DynamicContentScroll
          className={classNames(styles.container)}
          onScroll={!editMode ? onScroll : null}
          totalSize={
            parsedData.lazyLoading && onScroll && !editMode ? mediaLengthMs : 0
          }
          estimatedDisplaySize={estimatedDisplayTimeMs}
          neglectableSize={neglectableTimeMs}
          contents={ this.renderSpeakerSnippetSegments(parsedData) }
        />
      </div>
    );
  }
}
