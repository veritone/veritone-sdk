import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import { orderBy, reduce } from 'lodash';
import classNames from 'classnames';

import DynamicContentScroll from '../../share-components/scrolls/DynamicContentScroll';
import NoDataSegment from '../TranscriptSegment/NoDataSegment';
import SnippetSegment from '../TranscriptSegment/SnippetSegment';
import OverviewSegment from '../TranscriptSegment/OverviewSegment';
import TranscriptBulkEdit from '../TranscriptBulkEdit';

import styles from './styles.scss';
export const View = {
  TIME: 'TIME',
  OVERVIEW: 'OVERVIEW'
};

export const Edit = {
  BULK: 'BULK',
  SNIPPET: 'SNIPPET'
};

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
            guid: string,
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
    selectedEngineId: string,

    editMode: bool,
    viewType: string,
    editType: string,

    onClick: func,
    onScroll: func,
    onChange: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMs: number,

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  static defaultProps = {
    editMode: false,
    viewType: View.TIME,
    editType: Edit.SNIPPET,
    mediaPlayerTimeMs: 0,
    mediaPlayerTimeIntervalMs: 1000
  };

  handleOnClick = (target, value) => {
    this.props.onClick &&
      this.props.onClick(value.startTimeMs, value.stopTimeMs);
  };

  handleDataChanged = value => {
    this.props.onChange && this.props.onChange(value);
  };

  parseData() {
    if (!this.props.data) {
      return {
        lazyLoading: false,
        snippetSegments: [],
        overviewSegments: []
      };
    }

    const snippetSegments = [];
    const overviewSegments = [];

    let overviewStartTime = 0;
    let overviewStopTime = 0;
    let overviewParts = [];
    let overviewSentences = '';
    let overviewStatus = undefined;

    const saveOverviewData = () => {
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

    const textareaToDecodeCharacters = document.createElement('textarea');

    let lazyLoading = true;
    this.props.data.forEach(chunk => {
      const groupStartTime = chunk.startTimeMs;
      const groupStopTime = chunk.stopTimeMs;
      const groupStatus = chunk.status;

      lazyLoading =
        lazyLoading &&
        groupStartTime !== undefined &&
        groupStopTime !== undefined &&
        groupStatus !== undefined;

      const series = chunk.series;
      if (series && series.length > 0) {
        let snippetStatus = undefined;
        let snippetStartTime = groupStartTime;
        let snippetStopTime = undefined;
        let snippetParts = [];
        let snippetSentences = '';

        const saveSnippetData = () => {
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

        const sentenceSeparator = series.length ? ' ' : '';

        series.forEach((entry, entryIndex) => {
          //---Updata Content Value---
          if (entry.words) {
            // Has Transcript Data
            if (snippetStatus && snippetStatus !== 'success') {
              saveSnippetData();
            }
            if (overviewStatus && overviewStatus !== 'success') {
              saveOverviewData();
            }

            //---Get Correct Word---
            let selectedWord = '';
            let words = entry.words || [];
            words = orderBy(words, ['confidence'], ['desc']);
            if (words.length > 0) {
              selectedWord = words[0].word;
            }

            // ignore special words / states
            if (selectedWord === '!silence' ||
              selectedWord === '[noise]' ||
              selectedWord === '<noise>'
            ) {
              return;
            }

            snippetStatus = 'success';
            overviewStatus = 'success';

            // escape special characters to show in UI
            if (selectedWord) {
              textareaToDecodeCharacters.innerHTML = selectedWord;
              selectedWord = textareaToDecodeCharacters.value;
            }

            const snippet = {
              startTimeMs: entry.startTimeMs,
              stopTimeMs: entry.stopTimeMs,
              value: selectedWord
            };
            if (entry.guid) {
              snippet.guid = entry.guid;
            }

            //---Update Snippet Data---
            snippetSentences =
              snippetSentences + selectedWord + sentenceSeparator;
            snippetParts.push(snippet);
            //---Update Overview Data---
            overviewSentences =
              overviewSentences + selectedWord + sentenceSeparator;
            overviewParts.push(snippet);
          } else {
            // No Transcript Data
            if (snippetStatus && snippetStatus !== 'no-transcript') {
              saveSnippetData();
            }
            if (overviewStatus && overviewStatus !== 'no-transcript') {
              saveOverviewData();
            }
            snippetStatus = 'no-transcript';
            overviewStatus = 'no-transcript';
          }

          //---Update Start & Stop Time---
          if (
            snippetStartTime === undefined ||
            snippetStartTime > entry.startTimeMs
          ) {
            snippetStartTime = entry.startTimeMs;
          }
          if (
            snippetStopTime === undefined ||
            snippetStopTime < entry.stopTimeMs
          ) {
            snippetStopTime = entry.stopTimeMs;
          }
          if (
            entryIndex === series.length - 1 &&
            groupStopTime &&
            groupStopTime > snippetStopTime
          ) {
            snippetStopTime = groupStopTime;
          }
          if (
            overviewStartTime === undefined ||
            overviewStartTime > snippetStartTime
          ) {
            overviewStartTime = snippetStartTime;
          }
          if (
            overviewStopTime === undefined ||
            overviewStopTime < snippetStopTime
          ) {
            overviewStopTime = snippetStopTime;
          }
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
    const {
      editMode,
      viewType,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    const stopMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;

    const snippetSegments = [];
    parsedData.snippetSegments.forEach(segmentData => {
      const segment = {
        start: segmentData.startTimeMs,
        stop: segmentData.stopTimeMs
      };

      switch (segmentData.status) {
        case 'success':
          segment.content = (
            <SnippetSegment
              key={'transcript-snippet' + segmentData.startTimeMs}
              content={segmentData}
              editMode={editMode}
              showSegmentTime={viewType == View.TIME}
              onChange={this.handleDataChanged}
              onClick={this.handleOnClick}
              startMediaPlayHeadMs={mediaPlayerTimeMs}
              stopMediaPlayHeadMs={stopMediaPlayHeadMs}
              classNames={classNames(styles.contentSegment)}
            />
          );
          break;

        case 'no-transcript':
          segment.content = (
            <NoDataSegment
              key={'transcript--snippet' + segmentData.startTimeMs}
              startTimeMs={segmentData.startTimeMs}
              stopTimeMs={segmentData.stopTimeMs}
              editMode={editMode}
              onChange={this.handleDataChanged}
              startMediaPlayHeadMs={mediaPlayerTimeMs}
              stopMediaPlayHeadMs={stopMediaPlayHeadMs}
            />
          );
          break;
      }

      snippetSegments.push(segment);
    });
    return snippetSegments;
  };

  renderOverviewSegments = parsedData => {
    const {
      editMode,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    const stopMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
    const overviewSegments = parsedData.overviewSegments.map(segmentData => {
      const segmentStartTime = segmentData.startTimeMs;
      const segmentStopTime = segmentData.stopTimeMs;

      let segmentContent;
      switch (segmentData.status) {
        case 'success':
          segmentContent = (
            <OverviewSegment
              key={'transcript-overview' + segmentStartTime}
              content={segmentData}
              onClick={this.handleOnClick}
              startMediaPlayHeadMs={mediaPlayerTimeMs}
              stopMediaPlayHeadMs={stopMediaPlayHeadMs}
              classNames={classNames(styles.contentSegment)}
            />
          );
          break;
        case 'no-transcript':
          segmentContent = (
            <NoDataSegment
              key={'transcript--overview' + segmentStartTime}
              overview
              startTimeMs={segmentStartTime}
              stopTimeMs={segmentStopTime}
              editMode={editMode}
              onChange={this.handleDataChanged}
              startMediaPlayHeadMs={mediaPlayerTimeMs}
              stopMediaPlayHeadMs={stopMediaPlayHeadMs}
            />
          );
          break;
      }

      return {
        start: segmentStartTime,
        stop: segmentStopTime,
        content: segmentContent
      };
    });

    return overviewSegments;
  };

  renderBulkEdit = parsedData => {
    let overalStartTime = 0;
    let overalStopTime = 0;
    let overalString = '';

    const overviewSegments = reduce(
      parsedData.overviewSegments,
      (memo, segmentData, segmentIndex) => {
        const segmentStartTime = segmentData.startTimeMs;
        const segmentStopTime = segmentData.stopTimeMs;

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
          memo.push({
            start: overalStartTime,
            stop: overalStopTime,
            content: (
              <TranscriptBulkEdit
                key={
                  'transcript-bulk-edit:' +
                  overalStartTime +
                  '-' +
                  overalStopTime
                }
                content={overalString}
                onChange={this.handleDataChanged}
                startTimeMs={overalStartTime}
                stopTimeMs={overalStopTime}
                selectedEngineId={this.props.selectedEngineId}
              />
            )
          });
        }
        return memo;
      },
      []
    );

    return overviewSegments;
  };

  renderEditMode = parsedData => {
    let content;
    switch (this.props.editType) {
      case Edit.BULK:
        content = this.renderBulkEdit(parsedData);
        break;
      case Edit.SNIPPET:
        content = this.renderSnippetSegments(parsedData);
        break;
    }

    return content;
  };

  renderViewMode = parsedData => {
    let content;
    switch (this.props.viewType) {
      case View.TIME:
        content = this.renderSnippetSegments(parsedData);
        break;
      case View.OVERVIEW:
        content = this.renderOverviewSegments(parsedData);
        break;
    }

    return content;
  };

  render() {
    const {
      editMode,
      className,
      mediaLengthMs,
      neglectableTimeMs,
      estimatedDisplayTimeMs,
      onScroll
    } = this.props;

    const parsedData = this.parseData();

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
          contents={
            editMode
              ? this.renderEditMode(parsedData)
              : this.renderViewMode(parsedData)
          }
        />
      </div>
    );
  }
}
