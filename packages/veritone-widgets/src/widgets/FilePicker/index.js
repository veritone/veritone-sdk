import React from 'react';
import { bool, func, oneOf, number } from 'prop-types';
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
    failure: filePickerModule.didFail(state)
  }),
  {
    pick: filePickerModule.pick,
    cancelPick: filePickerModule.cancelPick,
    uploadRequest: filePickerModule.uploadRequest
  },
  null,
  { withRef: true }
)
class FilePickerWidget extends React.Component {
  static propTypes = {
    open: bool,
    pick: func,
    cancelPick: func,
    uploadRequest: func,
    pickerState: oneOf(['selecting', 'uploading', 'complete']),
    progressPercent: number
  };

  open = () => {
    this.props.pick();
  };

  cancel = () => {
    this.props.cancelPick();
  };

  _onFilesSelected = files => {
    this.props.uploadRequest(files);
  };

  renderPickerDialog = () => {
    return (
      <FilePickerDialog
        {...this.props}
        open={this.props.open}
        onRequestClose={this.cancel}
        onUploadFiles={this._onFilesSelected}
      />
    );
  };

  renderProgressDialog = () => {
    return (
      <ProgressDialog
        percentComplete={this.props.progressPercent}
        progressMessage="test"
        doneSuccess={false}
        doneFailure={false}
      />
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
