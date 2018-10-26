import React, { Component } from 'react';
import { number, string, func, shape } from 'prop-types';
import classNames from 'classnames';

import Chip from '@material-ui/core/Chip';

import styles from './styles.scss';

export default class SpeakerPill extends Component {
  static propTypes = {
    className: string,
    speakerSegment: shape({
      speakerId: string,
      startTimeMs: number,
      stopTimeMs: number,
      guid: string
    }).isRequired,
    onClick: func,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number
  };

  static defaultProps = {
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

  handlePillClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event, this.props.speakerSegment);
    }
  };

  renderSpeakerPill = () => {
    const {
      speakerId,
      startTimeMs,
      stopTimeMs,
      guid
    } = this.props.speakerSegment;
    const {
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;
    const speakerKey = guid ? guid : `speaker-pill-${startTimeMs}-${stopTimeMs}`;
    const isHighlighted = !(stopMediaPlayHeadMs < startTimeMs || startMediaPlayHeadMs > stopTimeMs);
    const colorClass = isHighlighted ? styles.highlight : '';

    return (
      <Chip
        className={ classNames(styles.speakerPill, colorClass) }
        key={ speakerKey }
        label={ speakerId }
        onClick={ this.handlePillClick }
        clickable
      />
    );
  };

  render() {
    return (
      <div className={ this.props.className }>
        { this.renderSpeakerPill() }
      </div>
    );
  }
};