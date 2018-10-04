import React, { Component } from 'react';
import { arrayOf, shape, bool, number, string, func } from 'prop-types';
import classNames from 'classnames';

import SnippetFragment from '../../TranscriptFragment/SnippetFragment';
import { msToReadableString } from '../../../../helpers/time';

import styles from './styles.scss';

export default class SnippetSegment extends Component {
  static propTypes = {
    content: shape({
      startTimeMs: number,
      stopTimeMs: number,
      sentences: string,
      fragments: arrayOf(
        shape({
          startTimeMs: number,
          stopTimeMs: number,
          value: string
        })
      )
    }),
    className: string,
    timeClassName: string,
    contentClassName: string,
    isSentenceMode: bool,
    showSegmentTime: bool,
    editMode: bool,
    onClick: func,
    onChange: func,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number
  };

  static defaultProps = {
    editMode: false,
    isSentenceMode: false,
    showSegmentTime: false,
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

  handleSnippetClick = (event, entryData) => {
    const { onClick } = this.props;

    if (onClick) {
      onClick(event, entryData);
    }
  };

  handleSnippetChange = entryData => {
    const { editMode, onChange } = this.props;

    if (editMode && onChange) {
      onChange(entryData);
    }
  };

  renderTime() {
    const { content, timeClassName } = this.props;

    const formatedTime = msToReadableString(content.startTimeMs, true);
    return (
      <div className={classNames(styles.time, timeClassName)}>
        {formatedTime}
      </div>
    );
  }

  renderFragments() {
    const {
      content,
      editMode,
      contentClassName,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;

    const contentComponents = content.fragments.map(entry => {
      const startTime = entry.startTimeMs;
      const stopTime = entry.stopTimeMs;
      const value = entry.value || '';
      const fragmentKey = entry.guid
        ? entry.guid
        : `snippet-fragment-${startTime}-${stopTime}-${value.substr(0, 32)}`;

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
          editMode={editMode}
          onClick={this.handleSnippetClick}
          onChange={this.handleSnippetChange}
        />
      );
    });

    return (
      <div className={classNames(styles.content, contentClassName)}>
        {contentComponents}
      </div>
    );
  }

  renderSentence() {
    const {
      content,
      editMode,
      contentClassName,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;

    const startTime = content.startTimeMs;
    const stopTime = content.stopTimeMs;

    return (
      <div className={classNames(styles.content, contentClassName)}>
        <SnippetFragment
          key={'sentence-' + startTime + '-' + stopTime}
          value={content.sentences}
          startTimeMs={startTime}
          stopTimeMs={stopTime}
          active={
            !(
              stopMediaPlayHeadMs < startTime || startMediaPlayHeadMs > stopTime
            )
          }
          editMode={editMode}
          onClick={this.handleSnippetClick}
          onChange={this.handleSnippetChange}
        />
      </div>
    );
  }

  render() {
    const { className, isSentenceMode, showSegmentTime } = this.props;

    return (
      <div className={classNames(styles.transcriptSegment, className)}>
        {showSegmentTime && this.renderTime()}
        {isSentenceMode ? this.renderSentence() : this.renderFragments()}
      </div>
    );
  }
}
