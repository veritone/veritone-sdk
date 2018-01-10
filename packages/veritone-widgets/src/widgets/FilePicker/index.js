import React from 'react';
import { noop } from 'lodash'
import { bool, func, oneOf, number, string } from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { FilePicker, ProgressDialog } from 'veritone-react-common';

import * as filePickerModule from '../../redux/modules/filePicker';
import widget from '../../shared/widget';

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

  pickCallback = noop;

  pick = (callback = noop) => {
    this.pickCallback = callback;
    this.props.pick();
  };

  cancel = () => {
    this.props.endPick();
  };

  _onFilesSelected = files => {
    this.props.uploadRequest(files, this.pickCallback);
  };

  _renderPickerDialog = () => {
    return (
      <Dialog open={this.props.open}>
        <FilePicker
          {...this.props}
          // fixme -- differentiate between cancel and closing because picking is done
          onRequestClose={this.cancel}
          onPickFiles={this._onFilesSelected}
        />
      </Dialog>
    );
  };

  _renderProgressDialog = () => {
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
      selecting: this._renderPickerDialog,
      uploading: this._renderProgressDialog,
      complete: this._renderProgressDialog
    }[this.props.pickerState]();
  }
}

export default widget(FilePickerWidget);
