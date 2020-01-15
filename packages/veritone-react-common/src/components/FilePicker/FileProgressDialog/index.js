import React from 'react';
import { number, string, oneOf, arrayOf, shape, any, func } from 'prop-types';
import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Info from '@material-ui/icons/Info';
import Warning from '@material-ui/icons/Warning';
import green from '@material-ui/core/colors/green';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { withStyles } from '@material-ui/styles';

import FilePickerHeader from '../FilePickerHeader';
import FileProgressList from '../FileProgressList';

import styles from './styles';

class FileProgressDialog extends React.Component {
  static propTypes = {
    percentByFiles: arrayOf(shape({
      key: string,
      value: shape({
        name: string,
        type: string,
        size: number,
        percent: number,
        error: any
      }).isRequired
    })),
    onClose: func.isRequired,
    onRetryDone: func.isRequired,
    retryRequest: func.isRequired,
    handleAbort: func,
    // height: number,
    width: number,
    progressMessage: string,
    completeStatus: oneOf(['success', 'failure', 'warning']),
    classes: shape({ any }),
  };

  static defaultProps = {
    percentByFiles: [],
    progressMessage: '',
    width: 600
  };

  handleAbortAll = () => {
    const { handleAbort } = this.props;
    handleAbort && handleAbort();
  }

  handleClose = () => {
    const { onClose } = this.props;
    this.handleAbortAll();
    onClose && onClose();
  }

  renderProgress() {
    const {
      percentByFiles,
      handleAbort,
      classes
    } = this.props;
    const closeFunc = handleAbort ? this.handleClose : null;

    return (
      <div>
        <FilePickerHeader
          title="Uploading"
          hideTabs
          onClose={closeFunc} />
        <div className={classes.progressListContainer}>
          <FileProgressList
            percentByFiles={percentByFiles}
            handleAbort={handleAbort} />
        </div>
      </div>
    );
  }

  renderComplete() {
    const { classes } = this.props;
    const icon = {
      success: (
        <CheckCircle classes={{ root: classes.resolveIcon }}
          style={{ fill: green[500] }}
          data-testtarget="successIcon"
        />
      ),
      failure: (
        <Info classes={{ root: classes.resolveIcon }}
          style={{ color: '#F44336' }}
          data-testtarget="failureIcon"
        />
      ),
      warning: (
        <Warning classes={{ root: classes.resolveIcon }}
          style={{ color: '#ffc107' }}
          data-testtarget="warnIcon"
        />
      )
    }[this.props.completeStatus];

    const {
      percentByFiles,
      onClose
    } = this.props;

    const completeDialog = this.props.completeStatus !== 'success' ? (
      <div className={classes.contentFlexer}>
        <FilePickerHeader
          title={`Upload ${this.props.completeStatus}`}
          message={this.props.progressMessage}
          titleIcon={icon}
          hideTabs
          onClose={onClose} />
        <div className={classes.contentFlexer}>
          <div className={classes.progressListContainer}>
            <FileProgressList percentByFiles={percentByFiles} showErrors />
          </div>
          <CardActions className={classes.resolveActions}>
            <Button
              onClick={this.props.onRetryDone}>
              Done
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.props.retryRequest}>
              Retry All
            </Button>
          </CardActions>
        </div>
      </div>
    ) : null;

    return completeDialog
  }

  render() {
    const { classes } = this.props;
    return (
      <Card
        className={classes.container}
        style={{ width: this.props.width }}>
        {this.props.completeStatus
          ? this.renderComplete() : this.renderProgress()
        }
      </Card>
    );
  }
}

export default withStyles(styles)(FileProgressDialog);
