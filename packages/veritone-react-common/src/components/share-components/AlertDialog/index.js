import React, { Component } from 'react';
import { any, bool, string, func, oneOfType } from 'prop-types';

import { omit } from 'lodash';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import styles from './styles.scss';

export default class AlertDialog extends Component {
  static propTypes = {
    open: bool,
    titleLabel: string,
    content: string,
    fullScreen: bool,
    disableBackdropClick: bool,
    disableEscapeKeyDown: bool,
    cancelButtonLabel: string,
    approveButtonLabel: string,
    onCancel: func,
    onApprove: func.isRequired,
    cancelValue: oneOfType([any]),
    approveValue: oneOfType([any])
  };

  static defaultProps = {
    open: false,
    titleLabel: '',
    content: '',
    fullScreen: false,
    disableBackdropClick: true,
    disableEscapeKeyDown: true,
    cancelValue: 'cancel',
    approveValue: 'approve',
    cancelButtonLabel: 'Cancel',
    approveButtonLabel: 'Continue'
  };

  handleCancel = event => {
    this.props.onCancel(this.props.cancelValue);
  };

  handleApprove = event => {
    this.props.onApprove(this.props.approveValue);
  };

  render() {
    const {
      open,
      titleLabel,
      content,
      onCancel,
      cancelButtonLabel,
      approveButtonLabel
    } = this.props;
    const forwardingProps = { ...this.props };
    const omittedProps = [
      'titleLabel',
      'onCancel',
      'onApprove',
      'cancelValue',
      'approveValue',
      'cancelButtonLabel',
      'approveButtonLabel'
    ];
    return (
      <Dialog
        {...omit(forwardingProps, omittedProps)}
        open={open}
        onClose={this.handleCancel}
        classes={{
          paper: styles.dialogPaper
        }}
      >
        <DialogTitle
          classes={{
            root: styles.dialogTitle
          }}
        >
          {titleLabel}
        </DialogTitle>
        <DialogContent
          classes={{
            root: styles.dialogContent
          }}
        >
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions
          classes={{ root: styles.dialogActions }}
        >
          {onCancel && (
            <Button
              onClick={this.handleCancel}
              classes={{ root: styles.actionButton }}
            >
              {cancelButtonLabel}
            </Button>
          )}
          <Button
            onClick={this.handleApprove}
            color="primary"
            variant="contained"
            classes={{ root: styles.actionButton }}
          >
            {approveButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
