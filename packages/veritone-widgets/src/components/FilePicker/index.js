import React from 'react';
import { noop } from 'lodash';
import { bool, func, oneOf, number, string } from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import {
  FilePicker as FilePickerComponent,
  ProgressDialog
} from 'veritone-react-common';

import * as filePickerModule from '../../redux/modules/filePicker';
import widget from '../../shared/widget';

@connect(
  (state, { _widgetId }) => ({
    open: filePickerModule.isOpen(state, _widgetId),
    pickerState: filePickerModule.state(state, _widgetId),
    progressPercent: filePickerModule.progressPercent(state, _widgetId),
    success: filePickerModule.didSucceed(state, _widgetId),
    error: filePickerModule.didError(state, _widgetId),
    warning: filePickerModule.didWarn(state, _widgetId),
    statusMessage: filePickerModule.statusMessage(state, _widgetId)
  }),
  {
    pick: filePickerModule.pick,
    endPick: filePickerModule.endPick,
    uploadRequest: filePickerModule.uploadRequest
  },
  null,
  { withRef: true }
)
class FilePicker extends React.Component {
  static propTypes = {
    _widgetId: string.isRequired,
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

  static defaultProps = {
    open: false
  };

  pickCallback = noop;

  pick = (callback = noop) => {
    this.pickCallback = callback;
    this.props.pick(this.props._widgetId);
  };

  cancel = () => {
    this.props.endPick(this.props._widgetId);
    this.pickCallback(null, { cancelled: true });
  };

  _onFilesSelected = files => {
    this.props.uploadRequest(this.props._widgetId, files, this.pickCallback);
  };

  _renderPickerDialog = () => {
    return (
      <Dialog open={this.props.open}>
        <FilePickerComponent
          {...this.props}
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

const FilePickerWidget = widget(FilePicker);
export { FilePicker as default, FilePickerWidget };
