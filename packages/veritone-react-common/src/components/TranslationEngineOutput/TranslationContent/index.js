import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import classNames from 'classnames';
import { sortBy, isNumber } from 'lodash';

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
    onRerunProcess: func.isRequired,

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
    const {
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

    const segments = [];
    let segmentStatus = undefined;
    let segmentStartTime = undefined;
    let segmentStopTime = undefined;

    const clearSegmentStatus = () => {
      segmentStatus = undefined;
      segmentStartTime = undefined;
      segmentStopTime = undefined;
    };

    const createErrorSegment = () => {
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

      clearSegmentStatus();
    };

    const createNoDataSegment = () => {
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

      clearSegmentStatus();
    };

    const createDataSegment = segmentComponents => {
      segments.push({
        start: segmentStartTime,
        stop: segmentStopTime,
        content: segmentComponents
      });

      clearSegmentStatus();
    };

    const sortedDataChunks = sortBy(contents, 'startTimeMs', 'stopTimeMs');
    sortedDataChunks.forEach((dataChunk, chunkIndex) => {
      const chunkStatus = dataChunk.status;
      const chunkStartTime = dataChunk.startTimeMs;
      const chunkStopTime = dataChunk.stopTimeMs;
      const sortedSeries =
        dataChunk.series && dataChunk.series.length > 0
          ? sortBy(dataChunk.series, 'startTimeMs', 'stopTimeMs')
          : [];

      let nextSegmentTime = undefined;
      if (isNumber(chunkStartTime)) {
        nextSegmentTime = chunkStartTime;
      } else if (sortedSeries.length > 0) {
        nextSegmentTime = sortedSeries[0].startTimeMs;
      }

      // wrap up unsaved segments if there is a big time gap between 2 countinuous chunks or data doesnt support gap
      const hasValidTime = isNumber(nextSegmentTime); // this should be true all the time
      const hasNeglectableTime = isNumber(neglectableTimeMs);
      const hasBigTimeGap =
        hasNeglectableTime &&
        hasValidTime &&
        nextSegmentTime - segmentStopTime > neglectableTimeMs;
      if (
        segmentStatus &&
        (!hasNeglectableTime || !hasValidTime || hasBigTimeGap)
      ) {
        // there is a valid gap between 2 continuos segments
        if (segmentStatus === 'error') {
          createErrorSegment();
        } else if (segmentStatus === 'nodata') {
          createNoDataSegment();
        }
      }

      // Handle error segments
      if (chunkStatus === 'error') {
        segmentStatus === 'nodata' && createNoDataSegment(); //Save previous no data segment if the time gap above doesn't catch it

        segmentStatus = chunkStatus;

        if (
          !isNumber(segmentStartTime) ||
          (hasValidTime && segmentStartTime > nextSegmentTime)
        ) {
          segmentStartTime = nextSegmentTime;
        }

        if (!isNumber(segmentStopTime) || segmentStopTime < chunkStopTime) {
          segmentStopTime = chunkStopTime;
        }
      } else {
        // update segment start time
        if (
          !isNumber(segmentStartTime) ||
          (hasValidTime && segmentStartTime > nextSegmentTime)
        ) {
          segmentStartTime = nextSegmentTime;
        }

        let dataSegmentComponents = [];

        sortedSeries.forEach(entry => {
          const entryStartTime = entry.startTimeMs;
          const entryStopTime = entry.stopTimeMs;
          const entryStatus = entry.words ? 'success' : 'nodata';
          segmentStatus = segmentStatus || entryStatus; // set segment status to entry status if it doesn't exist

          if (segmentStatus !== entryStatus) {
            // status has changed
            // ----Save Previous Segment----
            if (segmentStatus === 'success') {
              createDataSegment(dataSegmentComponents.slice(0));
              dataSegmentComponents = [];
            } else if (segmentStatus === 'nodata') {
              createNoDataSegment();
            } else if (segmentStatus === 'error') {
              createErrorSegment();
            }

            segmentStatus = entryStatus; // updata segment status
          }

          // ----Update Segment Time----
          if (
            !isNumber(segmentStartTime) ||
            segmentStartTime > entryStartTime
          ) {
            segmentStartTime = entryStartTime;
          }

          if (!isNumber(segmentStopTime) || segmentStopTime < entryStopTime) {
            segmentStopTime = entryStopTime;
          }

          // ----Setup New Segment----
          if (entryStatus === 'success' && entry.words.length > 0) {
            // ----------Draw Translation Text----------
            const isPlayHeadEnabled = mediaPlayerTimeMs >= 0;
            const mediaPlayerStopTimeMs =
              mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
            const flooredEntryStartTime =
              Math.floor(entryStartTime / 1000) * 1000;
            const ceiledEntryStartTime = Math.ceil(entryStopTime / 1000) * 1000;

            const wordOptions = sortBy(entry.words, 'confidence');
            dataSegmentComponents.push(
              <DataSegment
                content={wordOptions[0].word}
                startTimeMs={entryStartTime}
                stopTimeMs={entryStopTime}
                onClick={onClick}
                active={
                  isPlayHeadEnabled &&
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

        // save the last success segment before moving to the next chunk
        segmentStatus === 'success' &&
          createDataSegment(dataSegmentComponents.slice(0));
        // ----End looping through series content----
      }

      // Round up segment stop time if needed
      if (isNumber(segmentStopTime) && segmentStopTime < chunkStopTime) {
        segmentStopTime = chunkStopTime;
      }

      // Check for the last Data Chunk & wrap up the last segment
      if (chunkIndex === sortedDataChunks.length - 1) {
        segmentStatus === 'error' && createErrorSegment();
        segmentStatus === 'nodata' && createNoDataSegment();
      }
    });
    return segments;
  };

  render() {
    const {
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
        //requestTimeMs={1000}
      />
    );
  }
}
