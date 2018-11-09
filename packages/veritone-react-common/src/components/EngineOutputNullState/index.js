import React, { Component } from 'react';
import { string, func } from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { includes } from 'lodash';

import styles from './styles.scss';

const errorRunningEngineImage =
  '//static.veritone.com/veritone-ui/engine-error-red.svg';
const warningNoOutputDataImage =
  '//static.veritone.com/veritone-ui/warning-icon-lg.svg';

export default class EngineOutputNullState extends Component {
  static propTypes = {
    engineName: string.isRequired,
    engineStatus: string.isRequired,
    onRunProcess: func
  };

  isError(engineStatus) {
    return includes(['failed', 'cancelled', 'aborted'], engineStatus);
  }

  isProcessing(engineStatus) {
    return includes(
      [
        'pending',
        'running',
        'queued',
        'accepted',
        'standby_pending',
        'waiting',
        'resuming'
      ],
      engineStatus
    );
  }

  isFetching(engineStatus) {
    return engineStatus === 'fetching';
  }

  isNoData(engineStatus) {
    return engineStatus === 'no_data';
  }

  render() {
    const { engineName, onRunProcess, engineStatus } = this.props;
    return (
      <div className={styles.container}>
        {this.isError(engineStatus) && (
          <div>
            <img src={errorRunningEngineImage} />
            <p className={styles.message}>Error Running {engineName}</p>
            {onRunProcess && (
              <Button onClick={onRunProcess} variant="raised" color="primary">
                <Icon
                  className={'icon-run-process'}
                  classes={{ root: styles.iconClass }}
                />
                RERUN PROCESS
              </Button>
            )}
          </div>
        )}
        {this.isProcessing(engineStatus) && (
          <div>
            <CircularProgress size={80} color="primary" thickness={1} />
            <p className={styles.message}>Engine Processing...</p>
          </div>
        )}
        {this.isFetching(engineStatus) && (
          <div>
            <CircularProgress size={80} color="primary" thickness={1} />
          </div>
        )}
        {this.isNoData(engineStatus) && (
          <div>
            <img src={warningNoOutputDataImage} />
            <p className={styles.message}>No data</p>
          </div>
        )}
      </div>
    );
  }
}
