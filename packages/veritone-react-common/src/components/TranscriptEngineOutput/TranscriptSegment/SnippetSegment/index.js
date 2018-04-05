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
    sentenceMode: bool,
    editMode: bool,
    onClick: func,
    onChange: func,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number
  };

  static defaultProps = {
    editMode: false,
    sentenceMode: false,
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

  handleSnippetClick = (event, entryData) => {
    let { editMode, onClick } = this.props;

    if (!editMode && onClick) {
      onClick(event, entryData);
    }
  };

  handleSnippetChange = (event, entryData) => {
    let { editMode, onChange } = this.props;

    if (editMode && onChange) {
      onChange(event, entryData);
    }
  };

  renderTime(startTime) {
    let { content, timeClassName } = this.props;

    let formatedTime = msToReadableString(content.startTimeMs, true);
    return (
      <div className={classNames(styles.time, timeClassName)}>
        {formatedTime}
      </div>
    );
  }

  renderFragments() {
    let {
      content,
      editMode,
      contentClassName,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;

    let contentComponents = [];
    content.fragments.forEach((entry, index) => {
      let startTime = entry.startTimeMs;
      let stopTime = entry.stopTimeMs;

      contentComponents.push(
        <SnippetFragment
          key={'snippet-' + entry.value + '-' + startTime + '-' + stopTime}
          value={entry.value + ' '}
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
    let {
      content,
      editMode,
      contentClassName,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;

    let startTime = content.startTimeMs;
    let stopTime = content.stopTimeMs;

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
    let { className, sentenceMode } = this.props;

    return (
      <div className={classNames(styles.transcriptSegment, className)}>
        {this.renderTime()}
        {sentenceMode ? this.renderSentence() : this.renderFragments()}
      </div>
    );
  }
}
