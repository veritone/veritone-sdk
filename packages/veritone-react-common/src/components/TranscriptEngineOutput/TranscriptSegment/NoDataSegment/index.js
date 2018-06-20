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
    startTimeMs: number.isRequired,
    stopTimeMs: number.isRequired,
    className: string,
    timeClassName: string,
    contentClassName: string,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number
  };

  handleSnippetChange = entryData => {
    const { editMode, onChange } = this.props;

    if (editMode && onChange) {
      delete entryData.originalValue.value;
      onChange(entryData);
    }
  };

  renderInfoView() {
    return (
      <div className={classNames(styles.content, this.props.contentClassName)}>
        No Transcript Data Available
      </div>
    );
  }

  renderEditView() {
    const {
      startTimeMs,
      stopTimeMs,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;

    return (
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
        editMode
        onChange={this.handleSnippetChange}
        className={classNames(styles.snippet)}
      />
    );
  }

  render() {
    const {
      editMode,
      overview,
      startTimeMs,
      stopTimeMs,
      className,
      timeClassName
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
        {editMode ? this.renderEditView() : this.renderInfoView()}
      </div>
    );
  }
}
