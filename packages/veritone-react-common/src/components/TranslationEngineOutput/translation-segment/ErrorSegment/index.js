import React, { Component } from 'react';
import { number, string, func } from 'prop-types';
import classNames from 'classnames';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import { msToReadableString } from '../../../../helpers/time';

import styles from './styles.scss';

export default class ErrorSegment extends Component {
  static propTypes = {
    startTimeMs: number.isRequired,
    stopTimeMs: number.isRequired,
    description: string,
    buttonLabel: string,
    onClick: func.isRequired,
    className: string,
    timeClassName: string,
    messageClassName: string
  };

  static defaultProps = {
    description: 'Error Running Translation Engine',
    buttonLabel: 'RERUN PROCESS'
  };

  handleOnClick = () => {
    const { onClick, startTimeMs, stopTimeMs } = this.props;
    onClick && onClick(startTimeMs, stopTimeMs);
  };

  render() {
    const {
      startTimeMs,
      stopTimeMs,
      description,
      buttonLabel,
      className,
      timeClassName,
      messageClassName
    } = this.props;

    const startTimeString = msToReadableString(startTimeMs);
    const stopTimeString = msToReadableString(stopTimeMs);

    return (
      <div className={classNames(styles.errorSegment, className)}>
        <div className={classNames(styles.time, timeClassName)}>
          {startTimeString + ' - ' + stopTimeString}
        </div>
        <div className={classNames(styles.message, messageClassName)}>
          {description}
        </div>
        <div>
          <Button variant="raised" color="primary" onClick={this.handleOnClick}>
            <Icon className={'icon-run-process'} />&nbsp;
            {buttonLabel}
          </Button>
        </div>
      </div>
    );
  }
}
