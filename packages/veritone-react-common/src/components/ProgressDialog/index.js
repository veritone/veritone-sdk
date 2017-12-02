import React from 'react';
import { number, string, bool } from 'prop-types';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import CheckCircle from 'material-ui-icons/CheckCircle';
import RemoveCircle from 'material-ui-icons/RemoveCircle';
import green from 'material-ui/colors/green';
import red from 'material-ui/colors/red';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './styles.scss';

@withMuiThemeProvider
export default class ProgressDialog extends React.Component {
  static propTypes = {
    percentComplete: number,
    progressMessage: string,
    height: number,
    width: number,
    doneSuccess: bool,
    doneFailure: bool
  };

  static defaultProps = {
    percentComplete: 0,
    progressMessage: '',
    height: 400,
    width: 600
  };

  renderProgress() {
    return (
      <div className={styles.percentageContainer}>
        <div className={styles.percentage}>{this.props.percentComplete}%</div>
      </div>
    );
  }

  renderComplete() {
    return (
      <div className={styles.resolutionIconContainer}>
        {this.props.doneSuccess ? (
          <CheckCircle
            classes={{
              root: styles.resolutionIcon
            }}
            style={{
              fill: green[500]
            }}
            data-testtarget="successIcon"
          />
        ) : (
          <RemoveCircle
            classes={{
              root: styles.resolutionIcon
            }}
            style={{
              fill: red[500]
            }}
            data-testtarget="failureIcon"
          />
        )}
      </div>
    );
  }

  render() {
    // todo: error message, close button (when error is present)

    return (
      <Paper
        classes={{ root: styles.container }}
        style={{ height: this.props.height, width: this.props.width }}
      >
        <div className={styles.circularProgressContainer}>
          {!(this.props.doneSuccess || this.props.doneFailure) && (
            <CircularProgress
              className={styles.circularProgress}
              size={125}
              thickness={1}
            />
          )}
        </div>

        <div className={styles.textContainer}>
          {this.props.doneSuccess || this.props.doneFailure
            ? this.renderComplete()
            : this.renderProgress()}

          <div className={styles.progressMessage}>
            {this.props.progressMessage}
          </div>
        </div>
      </Paper>
    );
  }
}
