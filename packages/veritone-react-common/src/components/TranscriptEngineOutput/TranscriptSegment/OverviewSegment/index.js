import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import classNames from 'classnames';

import OverviewFragment from '../../TranscriptFragment/OverviewFragment';
import styles from './styles.scss';

export default class OverviewSegment extends Component {
  static propTypes = {
    content: shape({
      startTimeMs: number,
      stopTimeMs: number,
      sentence: string,
      fragments: arrayOf(
        shape({
          startTimeMs: number,
          stopTimeMs: number,
          value: string
        })
      )
    }),
    onClick: func,
    className: string,
    fragmentClassName: string,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number
  };

  static defaultProps = {
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

  handleFragmentClicked = (event, value) => {
    if (this.props.onClick) {
      this.props.onClick(event, value);
    }
  };

  renderReadContent = () => {
    const {
      content,
      fragmentClassName,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;

    const readContents = [];
    content.fragments.forEach(entry => {
      const startTime = entry.startTimeMs;
      const stopTime = entry.stopTimeMs;
      const value = entry.value || '';
      const fragmentKey = entry.guid ?
        entry.guid :
        `overview-fragment-${startTime}-${stopTime}-${value.substr(0, 32)}`;

      readContents.push(
        <OverviewFragment
          key={fragmentKey}
          content={entry}
          className={fragmentClassName}
          onClick={this.handleFragmentClicked}
          active={
            !(
              stopMediaPlayHeadMs < startTime || startMediaPlayHeadMs > stopTime
            )
          }
        />
      );
    });

    return readContents;
  };

  render() {
    return (
      <div className={classNames(styles.overviewSegment, this.props.className)}>
        {this.renderReadContent()}
      </div>
    );
  }
}
