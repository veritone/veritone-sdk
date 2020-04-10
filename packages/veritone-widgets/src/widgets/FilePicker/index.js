import React, { Fragment } from 'react';
import { noop } from 'lodash';
import { bool, func, oneOf, number, string, arrayOf, shape } from 'prop-types';
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
import 'cropperjs/dist/cropper.css';

@withPropsOnChange([], ({ id }) => ({
  id: id || guid()
}))
@connect(
  (state, { id }) => ({
    open: filePickerModule.isOpen(state, id),
    pickerState: filePickerModule.state(state, id),
    percentByFiles: filePickerModule.percentByFiles(state, id),
    success: filePickerModule.didSucceed(state, id),
    error: filePickerModule.didError(state, id),
    warning: filePickerModule.didWarn(state, id),
    statusMessage: filePickerModule.statusMessage(state, id)
  }),
  {
    pick: filePickerModule.pick,
    endPick: filePickerModule.endPick,
    abortRequest: filePickerModule.abortRequest,
    uploadRequest: filePickerModule.uploadRequest,
    retryRequest: filePickerModule.retryRequest,
    retryDone: filePickerModule.retryDone
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    // allow widget version of FilePicker to override uploadRequest
    uploadRequest: ownProps.uploadRequest || dispatchProps.uploadRequest,
    retryRequest: ownProps.retryRequest || dispatchProps.retryRequest,
    retryDone: ownProps.retryDone || dispatchProps.retryDone,
    abortRequest: ownProps.abortRequest || dispatchProps.abortRequest
  })
)
class FilePicker extends React.Component {
  static propTypes = {
    id: string.isRequired,
    open: bool,
    pick: func,
    endPick: func,
    abortRequest: func,
    uploadRequest: func,
    retryRequest: func,
    retryDone: func,
    pickerState: oneOf(['selecting', 'uploading', 'complete']),
    percentByFiles: arrayOf(shape({
      key: string.isRequired,
      value: shape({
        name: string,
        size: number,
        type: string,
        percent: number
      }).isRequired
    })),
    success: bool,
    error: bool,
    warning: bool,
    statusMessage: string,
    renderButton: func,
    onPickCancelled: func,
    onPick: func,
    height: number,
    width: number,
    enableResize: bool,
    aspectRatio: number,
  };

  static defaultProps = {
    open: false,
    onPickCancelled: noop,
    onPick: noop,
    percentByFiles: [],
    height: 450,
    width: 600,
    enableResize: false,
    aspectRatio: 16/9,
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

  handleRetryDone = () => {
    const {
      id,
      onPick,
      retryDone
    } = this.props;
    retryDone && retryDone(id, onPick);
  };

  handleRetry = () => {
    const {
      id,
      retryRequest,
      onPick
    } = this.props;
    retryRequest && retryRequest(id, onPick);
  };

  handleAbort = fileKey => {
    const { id, abortRequest } = this.props;
    abortRequest && abortRequest(id, fileKey);
  }

  renderProgressDialog = () => {
    let completeStatus = {
      [this.props.success]: 'success',
      [this.props.error]: 'failure',
      [this.props.warning]: 'warning'
    }[true];

    return (
      <Dialog open={this.props.open}>
        <FileProgressDialog
          height={this.props.height}
          width={this.props.width}
          onClose={this.cancel}
          percentByFiles={this.props.percentByFiles}
          progressMessage={this.props.statusMessage}
          handleAbort={this.handleAbort}
          retryRequest={this.handleRetry}
          onRetryDone={this.handleRetryDone}
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
    uploadRequest: filePickerModule.uploadRequest,
    retryRequest: filePickerModule.retryRequest,
    retryDone: filePickerModule.retryDone,
    abortRequest: filePickerModule.abortRequest
  },
  null,
  { forwardRef: true }
)
class FilePickerWidgetComponent extends React.Component {
  static propTypes = {
    _widgetId: string.isRequired,
    pick: func.isRequired,
    endPick: func.isRequired,
    uploadRequest: func.isRequired,
    retryRequest: func.isRequired,
    retryDone: func.isRequired,
    abortRequest: func.isRequired
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

  handleRetryRequest = id => {
    this.props.retryRequest(id, this.pickCallback);
  }

  handleRetryDone = id => {
    this.props.retryDone(id, this.pickCallback);
  }

  render() {
    return (
      <FilePicker
        id={this.props._widgetId}
        {...this.props}
        uploadRequest={this.handleUploadRequest}
        retryRequest={this.handleRetryRequest}
        retryDone={this.handleRetryDone}
        onPickCancelled={this.callCancelledCallback}
      />
    );
  }
}

const FilePickerWidget = widget(FilePickerWidgetComponent);
export { FilePicker as default, FilePickerWidget };
