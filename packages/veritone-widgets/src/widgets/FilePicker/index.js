import React, { Fragment } from 'react';
import { noop } from 'lodash';
import { bool, func, oneOf, number, string } from 'prop-types';
import { connect } from 'react-redux';
import { withPropsOnChange } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import {
  FilePicker as FilePickerComponent,
  FileProgressDialog
} from 'veritone-react-common';

import * as filePickerModule from '../../redux/modules/filePicker';
import { guid } from '../../shared/util';
import widget from '../../shared/widget';

// provide id prop on mount
@withPropsOnChange([], ({ id }) => ({
  id: id || guid()
}))
@connect(
  (state, { id }) => ({
    open: filePickerModule.isOpen(state, id),
    pickerState: filePickerModule.state(state, id),

    progressPercent: filePickerModule.progressPercent(state, id),
    percentByFiles: filePickerModule.percentByFiles(state, id),
    success: filePickerModule.didSucceed(state, id),
    error: filePickerModule.didError(state, id),
    warning: filePickerModule.didWarn(state, id),
    statusMessage: filePickerModule.statusMessage(state, id)
  }),
  {
    pick: filePickerModule.pick,
    endPick: filePickerModule.endPick,
    uploadRequest: filePickerModule.uploadRequest
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    // allow widget version of FilePicker to override uploadRequest
    uploadRequest: ownProps.uploadRequest || dispatchProps.uploadRequest
  })
)
class FilePicker extends React.Component {
  static propTypes = {
    id: string.isRequired,
    open: bool,
    pick: func,
    endPick: func,
    uploadRequest: func,
    pickerState: oneOf(['selecting', 'uploading', 'complete']),
    progressPercent: number,
    success: bool,
    error: bool,
    warning: bool,
    statusMessage: string,
    renderButton: func,
    onPickCancelled: func,
    onPick: func
  };

  static defaultProps = {
    open: false,
    onPickCancelled: noop,
    onPick: noop
  };

  handlePick = () => {
    this.props.pick(this.props.id);
  };

  cancel = () => {
    this.props.endPick(this.props.id);
    this.props.onPickCancelled();
  };

  onFilesSelected = files => {
    this.props.uploadRequest(this.props.id, files, this.props.onPick);
  };

  renderPickerDialog = () => {
    return (
      <Dialog open={this.props.open}>
        <FilePickerComponent
          {...this.props}
          onRequestClose={this.cancel}
          onPickFiles={this.onFilesSelected}
        />
      </Dialog>
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
        <FileProgressDialog
          percentByFiles={this.props.percentByFiles}
          percentComplete={this.props.progressPercent}
          progressMessage={this.props.statusMessage}
          completeStatus={completeStatus}
        />
      </Dialog>
    );
  };

  render() {
    const pickerComponent = {
      selecting: this.renderPickerDialog,
      uploading: this.renderProgressDialog,
      complete: this.renderProgressDialog
    }[this.props.pickerState]();

    return (
      <Fragment>
        {pickerComponent}
        {this.props.renderButton &&
          this.props.renderButton({ handlePickFiles: this.handlePick })}
      </Fragment>
    );
  }
}

@connect(
  null,
  {
    pick: filePickerModule.pick,
    endPick: filePickerModule.endPick,
    uploadRequest: filePickerModule.uploadRequest
  },
  null,
  { withRef: true }
)
class FilePickerWidgetComponent extends React.Component {
  static propTypes = {
    _widgetId: string.isRequired,
    pick: func.isRequired,
    endPick: func.isRequired,
    uploadRequest: func.isRequired
  };

  pickCallback = noop;
  componentPickCallback = noop;

  pick = (callback = noop) => {
    this.pickCallback = callback;
    this.props.pick(this.props._widgetId);
  };

  cancel = () => {
    this.props.endPick(this.props._widgetId);
    this.callCancelledCallback();
  };

  callCancelledCallback = () => {
    this.pickCallback(null, { cancelled: true });
  };

  handleUploadRequest = (id, files) => {
    this.props.uploadRequest(id, files, this.pickCallback);
  };

  render() {
    return (
      <FilePicker
        id={this.props._widgetId}
        {...this.props}
        uploadRequest={this.handleUploadRequest}
        onPickCancelled={this.callCancelledCallback}
      />
    );
  }
}

const FilePickerWidget = widget(FilePickerWidgetComponent);
export { FilePicker as default, FilePickerWidget };
