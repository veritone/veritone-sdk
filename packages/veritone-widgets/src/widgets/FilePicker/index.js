import React from 'react';
import { bool, func, oneOf, number, string } from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import {
  FilePicker as LibFilePicker,
  ProgressDialog
} from 'veritone-react-common';

import * as filePickerModule from '../../redux/modules/filePicker';
import widget from '../../shared/widget';

class FilePickerDialog extends React.Component {
  static propTypes = {
    open: bool
  };

  render() {
    // fixme -- kill this wrapper?
    const { open, ...pickerProps } = this.props;
    return (
      <Dialog open={open}>
        <LibFilePicker {...pickerProps} />
      </Dialog>
    );
  }
}

@connect(
  state => ({
    open: filePickerModule.isOpen(state),
    pickerState: filePickerModule.state(state),
    progressPercent: filePickerModule.progressPercent(state),
    success: filePickerModule.didSucceed(state),
    error: filePickerModule.didError(state),
    warning: filePickerModule.didWarn(state),
    statusMessage: filePickerModule.statusMessage(state)
  }),
  {
    pick: filePickerModule.pick,
    endPick: filePickerModule.endPick,
    uploadRequest: filePickerModule.uploadRequest
  },
  null,
  { withRef: true }
)
class FilePickerWidget extends React.Component {
  static propTypes = {
    open: bool,
    pick: func,
    endPick: func,
    uploadRequest: func,
    pickerState: oneOf(['selecting', 'uploading', 'complete']),
    progressPercent: number,
    success: bool,
    error: bool,
    warning: bool,
    statusMessage: string
  };

  open = () => {
    this.props.pick();
  };

  cancel = () => {
    this.props.endPick();
  };

  _onFilesSelected = files => {
    this.props.uploadRequest(files);
  };

  renderPickerDialog = () => {
    return (
      <FilePickerDialog
        {...this.props}
        open={this.props.open}
        // fixme -- differentiate between cancel and closing because picking is done
        onRequestClose={this.cancel}
        onUploadFiles={this._onFilesSelected}
      />
    );
  };

  renderProgressDialog = () => {
    let completeStatus = {
      [this.props.success]: 'success',
      [this.props.error]: 'failure',
      [this.props.warning]: 'warning'
    }[true];

    return (
      <Dialog open={this.props.open}>
        <ProgressDialog
          percentComplete={this.props.progressPercent}
          progressMessage={this.props.statusMessage}
          completeStatus={completeStatus}
        />
      </Dialog>
    );
  };

  render() {
    return {
      selecting: this.renderPickerDialog,
      uploading: this.renderProgressDialog,
      complete: this.renderProgressDialog
    }[this.props.pickerState]();
  }
}

export default widget(FilePickerWidget);
