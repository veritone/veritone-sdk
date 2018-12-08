import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import { orderBy, reduce, isArray, get, includes } from 'lodash';
import { format } from 'date-fns';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';

import DynamicContentScroll from '../../share-components/scrolls/DynamicContentScroll';
import SnippetSegment from '../TranscriptSegment/SnippetSegment';
import OverviewSegment from '../TranscriptSegment/OverviewSegment';
import TranscriptBulkEdit from '../TranscriptBulkEdit';
import { View, Edit } from '../TranscriptContent';
import SpeakerPill from '../SpeakerPill';
import EditableWrapper from '../ContentEditableWrapper/EditableWrapper';

import styles from './styles.scss';

export default class SpeakerTranscriptContent extends Component {
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
    speakerData: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        status: string,
        series: arrayOf(
          shape({
            startTimeMs: number,
            stopTimeMs: number,
            speakerId: string
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
    mediaPlayerTimeIntervalMs: number,

    selectedCombineViewTypeId: string
  };

  static defaultProps = {
    editMode: false,
    viewType: View.TIME,
    editType: Edit.SNIPPET,
    mediaPlayerTimeMs: 0,
    mediaPlayerTimeIntervalMs: 1000
  };

  handleOnClick = (event, seriesObject) => {
    this.props.onClick &&
      this.props.onClick(seriesObject.startTimeMs, seriesObject.stopTimeMs);
  };

  handleDataChanged = (event, newContent) => {
    this.props.onChange && this.props.onChange(event, newContent);
  };

  // totalTranscriptSegments will be mutated. This function picks off the first element
  // and allocates it to a speakers' fragments
  allocateSpeakerTranscripts = (totalTranscriptSegments, currentSpeaker, nextSpeaker) => {
    const speakerStartTime = currentSpeaker.startTimeMs;
    const speakerStopTime = currentSpeaker.stopTimeMs;
    const fragments = [];
    while (isArray(totalTranscriptSegments) && totalTranscriptSegments.length) {
      const currentSnippet = totalTranscriptSegments[0];
      // Allocate to current speaker if:
      if (
        // the snippet starts within speaker interval
        ( speakerStartTime <= currentSnippet.startTimeMs
          && currentSnippet.startTimeMs < speakerStopTime
        ) || 
        // Snippet startTimeMs did not fall into the previous AND current speakers aperture
        // Gotta do something with this snippet, so add it to the current speaker
        currentSnippet.startTimeMs < speakerStartTime ||
        // there are no more speakers then shove it into the current speaker
        !nextSpeaker
      ) {
        fragments.push(totalTranscriptSegments.shift());
      } else {
        // There is a next speaker and the current snippet does belong to the next speaker
        break;
      }
    }
    return fragments;
  };

  parseData() {
    if (!this.props.data) {
      return {
        lazyLoading: false,
        snippetSegments: [],
        overviewSegments: [],
        speakerSegments: []
      };
    }

    const snippetSegments = [];
    const overviewSegments = [];
    let speakerSegments = [];

    let overviewStartTime = 0;
    let overviewStopTime = 0;
    let overviewParts = [];
    let overviewSentences = '';
    let overviewStatus = undefined;

    const saveOverviewData = () => {
      const wordGuidMap = overviewParts.reduce((acc, entry, index) => {
        acc[entry.guid] = {
          index,
          serie: entry
        }
        return acc;
      }, {});

      //---Save Previous Overview Data---
      overviewSegments.push({
        startTimeMs: overviewStartTime,
        stopTimeMs: overviewStopTime,
        status: overviewStatus,
        sentences: overviewSentences,
        fragments: overviewParts.slice(),
        wordGuidMap
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

    // Speaker Data
    if (isArray(this.props.speakerData)){
      this.props.speakerData.forEach(chunk => {
        speakerSegments = speakerSegments.concat(chunk.series);
      });
    }

    saveOverviewData();

    return {
      lazyLoading: lazyLoading,
      snippetSegments: snippetSegments,
      overviewSegments: overviewSegments,
      speakerSegments: speakerSegments
    };
  }

  renderSpeakerSnippetSegments = parsedData => {
    const {
      editMode,
      viewType,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
      selectedCombineViewTypeId
    } = this.props;

    const stopMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
    const speakerSeries = parsedData.speakerSegments;

    let totalTranscriptSegmentData = [];
    parsedData.snippetSegments.forEach(segmentData => {
      totalTranscriptSegmentData = totalTranscriptSegmentData.concat(segmentData.fragments);
    });

    if (selectedCombineViewTypeId === 'speaker-view') {
      const speakerSnippetSegments = speakerSeries.map((speakerSegment, index) => {
        const nextSpeaker = speakerSeries[index + 1];
        const speakerStartTime = speakerSegment.startTimeMs;
        const speakerStopTime = speakerSegment.stopTimeMs;
        const fragments = this.allocateSpeakerTranscripts(
          totalTranscriptSegmentData,
          speakerSegment,
          nextSpeaker
        );

        const filteredSpeakerSegmentDataWrapper = { fragments };

        const timeFormat = speakerStartTime >= 3600000 ? 'HH:mm:ss' : 'mm:ss';
        const speakerTimingStart = format(speakerStartTime, timeFormat);
        const speakerTimingStop = format(speakerStopTime, timeFormat);

        const speakerGridKey = `speaker-edit-row-${speakerSegment.guid}`;

        const segmentContent = (
          <Grid container key={speakerGridKey}>
            <Grid item
              xs={4}
              sm={3}
              md={2}
              lg={1}
              xl={1}
            >
              <SpeakerPill
                speakerSegment={speakerSegment}
                onClick={this.handleOnClick}
                startMediaPlayHeadMs={mediaPlayerTimeMs}
                stopMediaPlayHeadMs={stopMediaPlayHeadMs}
              />
            </Grid>
            <Grid item xs sm md lg xl>
              <span className={styles.speakerStartTimeLabel}>
                {`${speakerTimingStart} - ${speakerTimingStop}`}
              </span>
              {
                <SnippetSegment
                  key={'transcript-speaker-snippet' + speakerStartTime}
                  content={filteredSpeakerSegmentDataWrapper}
                  editMode={editMode}
                  showSegmentTime={viewType == View.TIME}
                  onChange={this.handleDataChanged}
                  onClick={this.handleOnClick}
                  startMediaPlayHeadMs={mediaPlayerTimeMs}
                  stopMediaPlayHeadMs={stopMediaPlayHeadMs}
                  classNames={classNames(styles.contentSegment)}
                />
              }
            </Grid>
          </Grid>
        );

        return {
          start: speakerStartTime,
          stop: speakerStopTime,
          content: segmentContent
        };
      });

      return speakerSnippetSegments;
    } else {
      const overviewSegments = parsedData.overviewSegments.map(segmentData => {
        const segmentStartTime = segmentData.startTimeMs;
        const segmentStopTime = segmentData.stopTimeMs;
        const segmentContent = (
          <EditableWrapper
            key={'transcript-snippet' + segmentData.startTimeMs}
            content={segmentData}
            editMode={editMode}
            onChange={this.handleDataChanged}
            onClick={this.handleOnClick}
            startMediaPlayHeadMs={mediaPlayerTimeMs}
            stopMediaPlayHeadMs={stopMediaPlayHeadMs}
            classNames={classNames(styles.contentSegment)}
            wordGuidMap={parsedData.wordGuidMap}
          />
        );

        return {
          start: segmentStartTime,
          stop: segmentStopTime,
          content: segmentContent
        };
      });

      return overviewSegments;
    }
  };

  renderSpeakerOverviewSegments = parsedData => {
    const {
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
      selectedCombineViewTypeId
    } = this.props;

    const stopMediaPlayHeadMs = mediaPlayerTimeMs + mediaPlayerTimeIntervalMs;
    const speakerSeries = parsedData.speakerSegments;

    let totalTranscriptSegmentData = [];
    parsedData.overviewSegments.forEach(segmentData => {
      totalTranscriptSegmentData = totalTranscriptSegmentData.concat(segmentData.fragments);
    });

    if (selectedCombineViewTypeId === 'speaker-view') {
      const speakerOverviewSegments = speakerSeries.map((speakerSegment, index) => {
        const nextSpeaker = speakerSeries[index + 1];
        const speakerStartTime = speakerSegment.startTimeMs;
        const speakerStopTime = speakerSegment.stopTimeMs;
        const fragments = this.allocateSpeakerTranscripts(
          totalTranscriptSegmentData,
          speakerSegment,
          nextSpeaker
        );

        const filteredSpeakerSegmentDataWrapper = { fragments };

        const timeFormat = speakerStartTime >= 3600000 ? 'HH:mm:ss' : 'mm:ss';
        const speakerTimingStart = format(speakerStartTime, timeFormat);
        const speakerTimingStop = format(speakerStopTime, timeFormat);

        const speakerGridKey = `speaker-row-${speakerSegment.guid}`;

        const segmentContent = (
          <Grid container key={speakerGridKey}>
            <Grid item
              xs={4}
              sm={3}
              md={2}
              lg={1}
              xl={1}
            >
              <SpeakerPill
                speakerSegment={speakerSegment}
                onClick={this.handleOnClick}
                startMediaPlayHeadMs={mediaPlayerTimeMs}
                stopMediaPlayHeadMs={stopMediaPlayHeadMs}
              />
            </Grid>
            <Grid item xs sm md lg xl>
              <span className={styles.speakerStartTimeLabel}>
                {`${speakerTimingStart} - ${speakerTimingStop}`}
              </span>
              {
                <OverviewSegment
                  key={'transcript-speaker-overview' + speakerStartTime}
                  content={filteredSpeakerSegmentDataWrapper}
                  onClick={this.handleOnClick}
                  startMediaPlayHeadMs={mediaPlayerTimeMs}
                  stopMediaPlayHeadMs={stopMediaPlayHeadMs}
                  classNames={classNames(styles.contentSegment)}
                />
              }
            </Grid>
          </Grid>
        );

        return {
          startTimeMs: speakerStartTime,
          stopTimeMs: speakerStopTime,
          content: segmentContent
        }
      });

      return speakerOverviewSegments;
    } else {
      const overviewSegments = parsedData.overviewSegments.map(segmentData => {
        const segmentStartTime = segmentData.startTimeMs;
        const segmentStopTime = segmentData.stopTimeMs;
        const segmentContent = (
          <OverviewSegment
            key={'transcript-overview' + segmentStartTime}
            content={segmentData}
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

      return overviewSegments;
    }
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
    return this.renderSpeakerSnippetSegments(parsedData);
  };

  renderViewMode = parsedData => {
    return this.renderSpeakerOverviewSegments(parsedData);
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
          contents={ this.renderSpeakerSnippetSegments(parsedData) }
        />
      </div>
    );
  }
}
