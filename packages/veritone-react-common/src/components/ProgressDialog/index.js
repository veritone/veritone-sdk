import React from 'react';
import { number, string, oneOf, shape, any } from 'prop-types';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircle from '@material-ui/icons/CheckCircle';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import Warning from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { withStyles } from '@material-ui/styles';
import styles from './styles';

class ProgressDialog extends React.Component {
  static propTypes = {
    percentComplete: number,
    progressMessage: string,
    height: number,
    width: number,
    completeStatus: oneOf(['success', 'failure', 'warning']),
    classes: shape({ any }),
  };

  static defaultProps = {
    percentComplete: 0,
    progressMessage: '',
    height: 400,
    width: 600
  };

  renderProgress() {
    const { classes } = this.props;
    return (
      <div className={classes.percentageContainer}>
        <div className={classes.percentage}>{this.props.percentComplete}%</div>
      </div>
    );
  }

  renderComplete() {
    const {classes} = this.props;
    const icon = {
      success: (
        <CheckCircle
          classes={{
            root: classes.resolutionIcon
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
            root: classes.resolutionIcon
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
            root: classes.resolutionIcon
          }}
          style={{
            fill: yellow[500]
          }}
          data-testtarget="warnIcon"
        />
      )
    }[this.props.completeStatus];

    return <div className={classes.resolutionIconContainer}>{icon}</div>;
  }

  render() {
    // todo: error message, close button (when error is present)
    const { classes } = this.props;
    return (
      <Paper
        classes={{ root: classes.container }}
        style={{ height: this.props.height, width: this.props.width }}
      >
        <div className={classes.circularProgressContainer}>
          {!this.props.completeStatus && (
            <CircularProgress
              className={classes.circularProgress}
              size={125}
              thickness={1}
            />
          )}
        </div>

        <div className={classes.textContainer}>
          {this.props.completeStatus
            ? this.renderComplete()
            : this.renderProgress()}

          <div className={classes.progressMessage}>
            {this.props.progressMessage}
          </div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(ProgressDialog);
