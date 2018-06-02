import React, { Component } from 'react';
import { string, func } from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { includes } from 'lodash';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './styles.scss';

const nullStateImage = '//static.veritone.com/veritone-ui/engine-error-red.svg';

@withMuiThemeProvider
export default class EngineOutputNullState extends Component {
  static propTypes = {
    engineName: string.isRequired,
    engineStatus: string.isRequired,
    onRunProcess: func
  };

  isError(engineStatus) {
    return includes(['failed', 'cancelled'], engineStatus);
  }

  isProcessing(engineStatus) {
    return includes(
      ['pending', 'running', 'queued', 'accepted', 'standby_pending'],
      engineStatus
    );
  }

  render() {
    const { engineName, onRunProcess, engineStatus } = this.props;
    return (
      <div className={styles.container}>
        {this.isError(engineStatus) && (
          <div>
            <img src={nullStateImage} />
            <p>Error Running {engineName}</p>
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
            <p>Engine Processing...</p>
          </div>
        )}
      </div>
    );
  }
}
