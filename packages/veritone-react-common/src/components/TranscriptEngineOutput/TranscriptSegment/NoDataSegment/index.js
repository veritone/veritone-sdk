import React, { Component } from 'react';
import classNames from 'classnames';
import { string, number, bool, func } from 'prop-types';

import SnippetFragment from '../../TranscriptFragment/SnippetFragment';
import { msToReadableString } from '../../../../helpers/time';

import styles from './styles.scss';

export default class NoDataSegment extends Component {
  static propTypes = {
    editMode: bool,
    onChange: func,
    overview: bool,
    startTimeMs: number,
    stopTimeMs: number,
    className: string,
    timeClassName: string,
    contentClassName: string,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number
  };

  static defaultProps = {
    overview: false,
    startTimeMs: 0,
    stopTimeMs: 0
  };

  handleSnippetChange = (event, entryData) => {
    let { editMode, onChange } = this.props;

    if (editMode && onChange) {
      onChange(event, entryData);
    }
  };

  render() {
    let {
      editMode,
      overview,
      startTimeMs,
      stopTimeMs,
      className,
      timeClassName,
      contentClassName,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;

    let timeString = msToReadableString(startTimeMs, true);
    if (overview) {
      timeString = timeString + ' - ' + msToReadableString(stopTimeMs, true);
    }

    return (
      <div
        className={classNames(styles.transcriptNoData, className, {
          [styles.overview]: overview
        })}
      >
        <div className={classNames(styles.time, timeClassName)}>
          {timeString}
        </div>
        <div
          className={classNames(styles.content, contentClassName, {
            [styles.hidden]: editMode
          })}
        >
          No Transcript Data Available
        </div>
        <SnippetFragment
          key={'snippet-' + startTimeMs + '-' + stopTimeMs}
          value={'No Transcript Data Available '}
          active={
            !(
              stopMediaPlayHeadMs < startTimeMs ||
              startMediaPlayHeadMs > stopTimeMs
            )
          }
          startTimeMs={startTimeMs}
          stopTimeMs={stopTimeMs}
          editMode={editMode}
          onChange={this.handleSnippetChange}
          className={classNames(styles.snippet, { [styles.hidden]: !editMode })}
        />
      </div>
    );
  }
}
