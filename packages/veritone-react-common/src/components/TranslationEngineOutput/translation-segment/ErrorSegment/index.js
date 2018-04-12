import React, { Component } from 'react';
import { number, string, func } from 'prop-types';
import classNames from 'classnames';
import Button from 'material-ui/Button';
import { msToReadableString } from '../../../../helpers/time';


import styles from './styles.scss';

export default class ErrorSegment extends Component {
  static propTypes = {
    startTimeMs: number,
    stopTimeMs: number,
    onClick: func,
    className: string,
    timeClassName: string,
    messageClassName: string
  }

  handleOnClick = () => {
    let {
      onClick,
      startTimeMs,
      stopTimeMs
    } = this.props;
    
    (onClick) && onClick(startTimeMs, stopTimeMs);
  }

  render () {
    let {
      startTimeMs,
      stopTimeMs,
      className,
      timeClassName,
      messageClassName
    } = this.props;

    let startTimeString = msToReadableString(startTimeMs);
    let stopTimeString = msToReadableString(stopTimeMs);

    return (
      <div className={classNames(styles.errorSegment, className)}>
        <div className={classNames(styles.time, timeClassName)}>{startTimeString + ' - ' + stopTimeString}</div>
        <div className={classNames(styles.message, messageClassName)}>Error Running Translation Engine</div>
        <div>
          <Button variant="raised" color="primary" onClick={this.handleOnClick}>RERUN PROCESS</Button>
        </div>
      </div>
    );
  }
}