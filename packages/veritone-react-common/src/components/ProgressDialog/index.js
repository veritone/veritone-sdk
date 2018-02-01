import React from 'react';
import { number, string, oneOf } from 'prop-types';
import Paper from 'material-ui/es/Paper';
import { CircularProgress } from 'material-ui/es/Progress';
import CheckCircle from 'material-ui-icons/CheckCircle';
import RemoveCircle from 'material-ui-icons/RemoveCircle';
import Warning from 'material-ui-icons/Warning';
import green from 'material-ui/es/colors/green';
import red from 'material-ui/es/colors/red';
import yellow from 'material-ui/es/colors/yellow';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './styles.scss';

@withMuiThemeProvider
export default class ProgressDialog extends React.Component {
  static propTypes = {
    percentComplete: number,
    progressMessage: string,
    height: number,
    width: number,
    completeStatus: oneOf(['success', 'failure', 'warning'])
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
    const icon = {
      success: (
        <CheckCircle
          classes={{
            root: styles.resolutionIcon
          }}
          style={{
            fill: green[500]
          }}
          data-testtarget="successIcon"
        />
      ),

      failure: (
        <RemoveCircle
          classes={{
            root: styles.resolutionIcon
          }}
          style={{
            fill: red[500]
          }}
          data-testtarget="failureIcon"
        />
      ),

      warning: (
        <Warning
          classes={{
            root: styles.resolutionIcon
          }}
          style={{
            fill: yellow[500]
          }}
          data-testtarget="warnIcon"
        />
      )
    }[this.props.completeStatus];

    return <div className={styles.resolutionIconContainer}>{icon}</div>;
  }

  render() {
    // todo: error message, close button (when error is present)

    return (
      <Paper
        classes={{ root: styles.container }}
        style={{ height: this.props.height, width: this.props.width }}
      >
        <div className={styles.circularProgressContainer}>
          {!this.props.completeStatus && (
            <CircularProgress
              className={styles.circularProgress}
              size={125}
              thickness={1}
            />
          )}
        </div>

        <div className={styles.textContainer}>
          {this.props.completeStatus
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
