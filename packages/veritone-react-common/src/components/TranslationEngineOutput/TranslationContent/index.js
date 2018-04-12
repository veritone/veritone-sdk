import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import classNames from 'classnames';
import { sortBy } from 'lodash';

import DataSegment from '../translation-segment/DataSegment';
import ErrorSegment from '../translation-segment/ErrorSegment';
import NoDataSegment from '../translation-segment/NoDataSegment';
import DynamicContentScroll from '../../share-components/scrolls/DynamicContentScroll';
import styles from './styles.scss';

export default class TranslationContent extends Component {
  static propTypes = {
    contents: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(
          shape({
            startTimeMs: number,
            stopTimeMs: number,
            status: string,
            words: arrayOf(
              shape({
                word: string,
                confidence: number
              })
            )
          })
        )
      })
    ),

    className: string,
    dataSegmentClassName: string,
    errorSegmentClassName: string,
    noDataSegmentClassName: string,

    onClick: func,
    onScroll: func,
    onRerunProcess: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMs: number,

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  static defaultProps = {
    mediaPlayerTimeMs: -1,
    mediaPlayerTimeIntervalMs: 1000
  };

  renderContents = () => {
    let {
      contents,

      onClick,
      onRerunProcess,

      dataSegmentClassName,
      errorSegmentClassName,
      noDataSegmentClassName,

      neglectableTimeMs,

      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    let segments = [];
    let segmentStatus;
    let segmentStartTime;
    let segmentStopTime;

    let clearSegmentStatus = () => {
      segmentStatus = undefined;
      segmentStartTime = undefined;
      segmentStopTime = undefined;
    };

    let createErrorSegment = () => {
      segments.push({
        start: segmentStartTime,
        stop: segmentStopTime,
        content: (
          <ErrorSegment
            startTimeMs={segmentStartTime}
            stopTimeMs={segmentStopTime}
            className={classNames(styles.boxSegment, errorSegmentClassName)}
            onClick={onRerunProcess}
            key={
              'translation-error-' + segmentStartTime + '-' + segmentStopTime
            }
          />
        )
      });

      segmentStartTime = segmentStopTime;
      segmentStopTime = undefined;
    };

    let createNoDataSegment = () => {
      segments.push({
        start: segmentStartTime,
        stop: segmentStopTime,
        content: (
          <NoDataSegment
            startTimeMs={segmentStartTime}
            stopTimeMs={segmentStopTime}
            className={classNames(styles.boxSegment, noDataSegmentClassName)}
            key={
              'translation-nodata-' + segmentStartTime + '-' + segmentStopTime
            }
          />
        )
      });

      segmentStartTime = segmentStopTime;
      segmentStopTime = undefined;
    };

    let createDataSegment = dataSegments => {
      segments.push({
        start: segmentStartTime,
        stop: segmentStopTime,
        content: dataSegments
      });

      segmentStartTime = segmentStopTime;
      segmentStopTime = undefined;
    };

    contents.forEach((dataChunk, chunkIndex) => {
      let chunkStartTime = dataChunk.startTimeMs;
      let chunkStopTime = dataChunk.stopTimeMs;

      if (segmentStartTime === undefined || segmentStartTime < chunkStartTime) {
        segmentStartTime = chunkStartTime;
      }

      let series = sortBy(dataChunk.series, 'startTimeMs', 'stopTimeMs');
      let dataSegmentEntries = [];
      // ----Start looping through series content----
      series.forEach(entry => {
        let entryStartTime = entry.startTimeMs;
        let entryStopTime = entry.stopTimeMs;
        let entryStatus = entry.status || (entry.words ? 'success' : 'nodata');

        if (segmentStatus === undefined) {
          segmentStatus = entryStatus;
        } else if (segmentStatus !== entryStatus) {
          // ----Save Previous Segment----
          if (segmentStatus === 'success') {
            createDataSegment(dataSegmentEntries.concat([]));
            dataSegmentEntries = [];
          } else if (segmentStatus === 'nodata') {
            createNoDataSegment();
          }

          segmentStatus = entryStatus; // updata segment status
        }

        // ----Update Segment Time----
        if (
          segmentStartTime === undefined ||
          segmentStartTime > entryStartTime
        ) {
          segmentStartTime = entryStartTime;
        }

        if (segmentStopTime === undefined || segmentStopTime < entryStopTime) {
          segmentStopTime = entryStopTime;
        }

        // ----Setup New Segment----
        if (entryStatus === 'error') {
          createErrorSegment();
        } else if (entryStatus === 'success' && entry.words.length > 0) {
          // ----------Draw Translation Text----------
          let playHeadEnabled = mediaPlayerTimeMs >= 0;
          let mediaPlayerStopTimeMs =
            mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
          let flooredEntryStartTime = Math.floor(entryStartTime / 1000) * 1000;
          let ceiledEntryStartTime = Math.ceil(entryStopTime / 1000) * 1000;

          let wordOptions = sortBy(entry.words, 'confidence');
          dataSegmentEntries.push(
            <DataSegment
              content={wordOptions[0].word}
              startTimeMs={entryStartTime}
              stopTimeMs={entryStopTime}
              onClick={onClick}
              active={
                playHeadEnabled &&
                !(
                  mediaPlayerTimeMs > ceiledEntryStartTime ||
                  mediaPlayerStopTimeMs < flooredEntryStartTime
                )
              }
              className={classNames(styles.dataSegment, dataSegmentClassName)}
              key={'translation-data-' + entryStartTime + '-' + entryStopTime}
            />
          );
        }
      });
      // ----End looping through series content----

      // ----End of Data Chunk----
      if (segmentStopTime === undefined || chunkStopTime > segmentStopTime) {
        segmentStopTime = chunkStopTime;
      }

      if (
        segmentStatus === 'nodata' &&
        isNaN(neglectableTimeMs) &&
        neglectableTimeMs > 0 &&
        chunkIndex < contents.length - 1
      ) {
        let nextDataChunk = contents[chunkIndex + 1];
        let nextChunkStartTime = nextDataChunk.startTimeMs;
        if (nextChunkStartTime - neglectableTimeMs <= segmentStopTime) {
          // Extends no data segment to the next entry
          if (segmentStopTime < nextChunkStartTime) {
            segmentStopTime = nextChunkStartTime;
          }
        } else {
          // Close no data segment since there's a gap between the current chunk & the next
          createNoDataSegment();
          clearSegmentStatus();
        }
      } else {
        segmentStatus === 'nodata' && createNoDataSegment();
        segmentStatus === 'success' &&
          createDataSegment(dataSegmentEntries.concat([]));
        clearSegmentStatus();
      }
    });

    return segments;
  };

  render() {
    let {
      className,
      onScroll,
      mediaLengthMs,
      neglectableTimeMs,
      estimatedDisplayTimeMs
    } = this.props;

    return (
      <DynamicContentScroll
        className={classNames(styles.translationContent, className)}
        onScroll={onScroll}
        totalSize={onScroll ? mediaLengthMs : 0}
        estimatedDisplaySize={estimatedDisplayTimeMs}
        neglectableSize={neglectableTimeMs}
        contents={this.renderContents()}
      />
    );
  }
}
