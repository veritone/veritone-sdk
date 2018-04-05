import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import { sortBy } from 'lodash';
import classNames from 'classnames';

import DynamicContentScroll from '../../Parts/Scrolls/DynamicContentScroll';
import NoDataSegment from '../TranscriptSegment/NoDataSegment';
import SnippetSegment from '../TranscriptSegment/SnippetSegment';
import OverviewSegment from '../TranscriptSegment/OverviewSegment';
import TranscriptBulkEdit from '../TranscriptBulkEdit';

import styles from './styles.scss';

export default class TranscriptContent extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        status: string,
        series: arrayOf(
          shape({
            startTimeMs: number,
            stopTimeMs: number,
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

    editMode: bool,
    overview: bool,

    onClick: func,
    onScroll: func,

    numMaxRequest: number,
    requestSizeMs: number,
    mediaLengthMs: number,
    neglectableTimeMs: number,
    mediaPlayerTime: number,
    mediaPlayerTimeInterval: number
  };

  static defaultProps = {
    editMode: false,
    overview: false,
    numMaxRequest: 2,
    mediaPlayerTime: 0,
    mediaPlayerTimeInterval: 1000
  };

  handleOnScroll = openSlotInfo => {
    this.props.onScroll && this.props.onScroll(openSlotInfo);
  };

  parseData() {
    if (!this.props.data) {
      return {
        lazyLoading: false,
        snippetSegments: [],
        overviewSegments: []
      };
    }

    let snippetSegments = [];
    let overviewSegments = [];

    let overviewStartTime = 0;
    let overviewStopTime = 0;
    let overviewParts = [];
    let overviewSentences = '';
    let overviewStatus = undefined;

    let saveOverviewData = () => {
      //---Save Previous Overview Data---
      overviewSegments.push({
        startTimeMs: overviewStartTime,
        stopTimeMs: overviewStopTime,
        status: overviewStatus,
        sentences: overviewSentences,
        fragments: overviewParts.concat([])
      });
      //---Reset Overview Data to Handle New Status---
      overviewStatus = undefined;
      overviewStartTime = undefined;
      overviewStopTime = undefined;
      overviewParts = [];
      overviewSentences = '';
    };

    let lazyLoading = true;
    this.props.data.forEach(chunk => {
      let groupStartTime = chunk.startTimeMs;
      let groupStopTime = chunk.stopTimeMs;
      let groupStatus = chunk.status;

      lazyLoading =
        lazyLoading &&
        groupStartTime !== undefined &&
        groupStopTime !== undefined &&
        groupStatus !== undefined;

      let series = chunk.series;
      if (series && series.length > 0) {
        let snippetStatus = undefined;
        let snippetStartTime = groupStartTime;
        let snippetStopTime = undefined;
        let snippetParts = [];
        let snippetSentences = '';

        let saveSnippetData = () => {
          //---Save Previous Snippets Data---
          snippetSegments.push({
            startTimeMs: snippetStartTime,
            stopTimeMs: snippetStopTime,
            status: snippetStatus,
            sentences: snippetSentences,
            fragments: snippetParts.concat([])
          });

          //---Reset Snippets Data---
          snippetStatus = undefined;
          snippetStartTime = undefined;
          snippetStopTime = undefined;
          snippetParts = [];
          snippetSentences = '';
        };

        series.forEach((entry, entryIndex) => {
          //---Updata Content Value---
          if (entry.words) {
            // Has Transcript Data
            snippetStatus !== undefined &&
              snippetStatus !== 'success' &&
              saveSnippetData();
            overviewStatus !== undefined &&
              overviewStatus !== 'success' &&
              saveOverviewData();

            snippetStatus = 'success';
            overviewStatus = 'success';

            //---Get Correct Word---
            let selectedWord;
            let words = entry.words;
            words ? (words = sortBy(words, 'confidence')) : (words = []);
            words.length > 0
              ? (selectedWord = words[0].word)
              : (selectedWord = '');

            //---Update Snippet Data---
            snippetSentences = snippetSentences + selectedWord + ' ';
            snippetParts.push({
              startTimeMs: entry.startTimeMs,
              stopTimeMs: entry.stopTimeMs,
              value: selectedWord
            });

            //---Update Overview Data---
            overviewSentences = overviewSentences + selectedWord + ' ';
            overviewParts.push({
              startTimeMs: entry.startTimeMs,
              stopTimeMs: entry.stopTimeMs,
              value: selectedWord
            });
          } else {
            // No Transcript Data
            snippetStatus !== undefined &&
              snippetStatus !== 'no-transcript' &&
              saveSnippetData();
            overviewStatus !== undefined &&
              overviewStatus !== 'no-transcript' &&
              saveOverviewData();

            snippetStatus = 'no-transcript';
            overviewStatus = 'no-transcript';
          }

          //---Update Start & Stop Time---
          (snippetStartTime === undefined ||
            snippetStartTime > entry.startTimeMs) &&
            (snippetStartTime = entry.startTimeMs);
          (snippetStopTime === undefined ||
            snippetStopTime < entry.stopTimeMs) &&
            (snippetStopTime = entry.stopTimeMs);
          entryIndex === series.length - 1 &&
            groupStopTime &&
            groupStopTime > snippetStopTime &&
            (snippetStopTime = groupStopTime);

          (overviewStartTime === undefined ||
            overviewStartTime > snippetStartTime) &&
            (overviewStartTime = snippetStartTime);
          (overviewStopTime === undefined ||
            overviewStopTime < snippetStopTime) &&
            (overviewStopTime = snippetStopTime);
        });

        saveSnippetData();
      }
    });

    saveOverviewData();

    return {
      lazyLoading: lazyLoading,
      snippetSegments: snippetSegments,
      overviewSegments: overviewSegments
    };
  }

  renderSnippetSegments = parsedData => {
    let {
      onClick,
      editMode,
      mediaPlayerTime,
      mediaPlayerTimeInterval
    } = this.props;

    let stopMediaPlayHeadMs = mediaPlayerTime + mediaPlayerTimeInterval;

    let snippetSegments = [];
    parsedData.snippetSegments.forEach(segmentData => {
      let segment = {
        start: segmentData.startTimeMs,
        stop: segmentData.stopTimeMs
      };

      switch (segmentData.status) {
        case 'success':
          segment.value = (
            <SnippetSegment
              key={'transcript-snippet' + segmentData.startTimeMs}
              content={segmentData}
              editMode={editMode}
              onClick={onClick}
              startMediaPlayHeadMs={mediaPlayerTime}
              stopMediaPlayHeadMs={stopMediaPlayHeadMs}
              classNames={classNames(styles.contentSegment)}
            />
          );
          break;

        case 'no-transcript':
          segment.value = (
            <NoDataSegment
              key={'transcript--snippet' + segmentData.startTimeMs}
              startTimeMs={segmentData.startTimeMs}
              stopTimeMs={segmentData.stopTimeMs}
            />
          );
          break;
      }

      snippetSegments.push(segment);
    });
    return snippetSegments;
  };

  renderOverviewSegments = parsedData => {
    let {
      onClick,
      editMode,
      mediaPlayerTime,
      mediaPlayerTimeInterval
    } = this.props;

    let stopMediaPlayHeadMs = mediaPlayerTime + mediaPlayerTimeInterval;

    let overalStartTime = 0;
    let overalStopTime = 0;
    let overalString = '';

    let overviewSegments = [];
    parsedData.overviewSegments.forEach((segmentData, segmentIndex) => {
      let segmentStartTime = segmentData.startTimeMs;
      let segmentStopTime = segmentData.stopTimeMs;

      if (editMode) {
        overalStartTime > segmentStartTime &&
          (overalStartTime = segmentStartTime);
        overalStopTime < segmentStopTime && (overalStopTime = segmentStopTime);

        if (segmentData.status === 'success') {
          overalString = overalString + segmentData.sentences;
        } else {
          overalString = overalString + '\n\n\n';
        }

        if (segmentIndex === parsedData.overviewSegments.length - 1) {
          // Reach the last segment
          overviewSegments.push({
            start: overalStartTime,
            stop: overalStopTime,
            value: (
              <TranscriptBulkEdit
                key={'transcript-bulk-edit' + overalStopTime}
                content={overalString}
              />
            )
          });
        }
      } else {
        let segmentValue;
        switch (segmentData.status) {
          case 'success':
            segmentValue = (
              <OverviewSegment
                key={'transcript-overview' + segmentStartTime}
                content={segmentData}
                onClick={onClick}
                startMediaPlayHeadMs={mediaPlayerTime}
                stopMediaPlayHeadMs={stopMediaPlayHeadMs}
                classNames={classNames(styles.contentSegment)}
              />
            );
            break;
          case 'no-transcript':
            segmentValue = (
              <NoDataSegment
                key={'transcript--overview' + segmentStartTime}
                overview
                startTimeMs={segmentStartTime}
                stopTimeMs={segmentStopTime}
              />
            );
            break;
        }

        overviewSegments.push({
          start: segmentStartTime,
          stop: segmentStopTime,
          value: segmentValue
        });
      }
    });

    return overviewSegments;
  };

  render() {
    let {
      overview,
      className,
      numMaxRequest,
      requestSizeMs,
      mediaLengthMs,
      neglectableTimeMs
    } = this.props;

    let parsedData = this.parseData();

    return (
      <div className={classNames(styles.transcriptContent, className)}>
        <DynamicContentScroll
          className={classNames(styles.container)}
          onScroll={this.handleOnScroll}
          totalSize={parsedData.lazyLoading ? mediaLengthMs : 0}
          segmentSize={requestSizeMs}
          neglectableSize={neglectableTimeMs}
          numSegmentPerUpdate={numMaxRequest}
          contents={
            overview
              ? this.renderOverviewSegments(parsedData)
              : this.renderSnippetSegments(parsedData)
          }
        />
      </div>
    );
  }
}
