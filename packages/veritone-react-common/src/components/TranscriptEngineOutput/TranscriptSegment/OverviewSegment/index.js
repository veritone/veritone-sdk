import React, {Component} from 'react';
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
      fragments: arrayOf(shape({
        startTimeMs: number,
        stopTimeMs: number,
        value: string
      }))
    }),
    mediaPlayerTime: number,
    onClick: func,
    className: string,
    fragmentClassName: string,
  };

  handleFragmentClicked = (event, value) => {
    if (this.props.onClick) {
      this.props.onClick(event, value);
    }
  }

  renderReadContent = () => {
    let {
      content,
      mediaPlayerTime,
      fragmentClassName
    } = this.props;

    let readContents = [];
    content.fragments.forEach(fragmentData => {
      let startTime = fragmentData.startTimeMs;
      let stopTime = fragmentData.stopTimeMs;

      readContents.push(
        <OverviewFragment 
          key={'overview-fragment' + fragmentData.startTimeMs} 
          content={fragmentData} 
          className={fragmentClassName} 
          onClick={this.handleFragmentClicked} 
          active={mediaPlayerTime >= startTime && mediaPlayerTime <= stopTime}
        />
      );
    });

    return readContents;
  }

  render () {
    return (
      <div className={classNames(styles.overviewSegment, this.props.className)}>
        {this.renderReadContent()}
      </div>
    );
  }
}