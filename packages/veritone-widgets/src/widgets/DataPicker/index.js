import React, { Fragment } from 'react';
import {
  string,
  bool,
  oneOf,
  arrayOf,
  shape,
  any,
  number,
  func
} from 'prop-types';
import { noop, isArray } from 'lodash';

import { connect } from 'react-redux';
import { withPropsOnChange } from 'recompose';

import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';

import { DataPicker as DataPickerComponent } from 'veritone-react-common';

import * as dataPickerModule from '../../redux/modules/dataPicker';
import * as filePickerModule from '../../redux/modules/filePicker';
import { guid } from '../../shared/util';
import widget from '../../shared/widget';

import styles from './styles.scss';

@withPropsOnChange([], ({ id }) => ({
  id: id || guid()
}))
@connect(
  (state, { id }) => ({
    open: dataPickerModule.isOpen(state, id),
    pathList: dataPickerModule.currentPath(state, id),
    availablePickerTypes: dataPickerModule.availablePickerTypes(state, id),
    currentPickerType: dataPickerModule.currentPickerType(state, id),
    itemRefs: dataPickerModule.currentDirectoryItems(state, id),
    currentDirectoryLoadingState: dataPickerModule.currentDirectoryLoadingState(state, id),
    getItemByTypeAndId: dataPickerModule.getItemByTypeAndId(state),

    percentByFiles: filePickerModule.percentByFiles(state, id),
    uploadPickerState: filePickerModule.state(state, id),
    uploadSuccess: filePickerModule.didSucceed(state, id),
    uploadError: filePickerModule.didError(state, id),
    uploadWarning: filePickerModule.didWarn(state, id),
    uploadStatusMsg: filePickerModule.statusMessage(state, id)
  }),
  {
    pick: dataPickerModule.pick,
    endPick: dataPickerModule.endPick,
    setPickerType: dataPickerModule.setPickerType,
    fetchPage: dataPickerModule.fetchPage,
    selectNode: dataPickerModule.selectNode,
    selectCrumb: dataPickerModule.selectCrumb,

    uploadToTDO: dataPickerModule.uploadToTDO,
    abortRequest: filePickerModule.abortRequest,
    retryRequest: dataPickerModule.retryRequest,
    retryDone: dataPickerModule.retryDone
  }
)
class DataPicker extends React.Component {
  static propTypes = {
    id: string.isRequired,
    open: bool,
    pick: func,
    onPick: func.isRequired,
    onPickCancelled: func,
    enableFolders: bool,
    enableStreams: bool,
    enableUploads: bool,
    multiple: bool,
    maxItems: number,
    acceptedFileTypes: arrayOf(string),
    availablePickerTypes: arrayOf(string),
    currentPickerType: oneOf(['folder', 'stream', 'upload']),
    currentViewType: oneOf(['list', 'grid']),
    pathList: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    sortCriteria: arrayOf(
      shape({
        field: string,                  // Default 'name'
        direction: oneOf(['asc', 'desc']) // Default 'asc'
      })
    ),
    itemRefs: arrayOf(
      shape({
        id: string,
        type: string
      })
    ),
    items: arrayOf(
      shape({
        id: string.isRequired,
        type: oneOf('folder', 'source', 'program', 'tdo').isRequired,
        name: string,
        startDateTime: string, 
        stopDateTime: string,
        thumbnailUrl: string,
        sourceImageUrl: string,
        primaryAsset: shape({
            name: string,
            contentType: string.isRequired,
            signedUri: string.isRequired
        }),
        streams: arrayOf(
          shape({
              uri: string.isRequired,
              protocol: string.isRequired
          })
        ),
        createdDateTime: string.isRequired,
        modifiedDateTime: string.isRequired
      })
    ),
    currentDirectoryLoadingState: shape({
      isLoading: bool,
      nodeOffset: number,
      leafOffset: number
    }),
    fetchPage: func.isRequired,
    selectNode: func.isRequired,
    getItemByTypeAndId: func.isRequired
  };

  static defaultProps = {
    open: false,
    onPick: noop,
    onPickCancelled: noop,
    availablePickerTypes: [],
    currentDirectoryLoadingState: {
      isLoading: false,
      nodeOffset: -1,
      leafOffset: -1
    },
    itemRefs: []
  };

  state = {
    uploadedFiles: []
  };

  handlePick = () => {
    const { id, pick } = this.props;
    id && pick && pick(id);
  };

  handleOnPick = (pickedRefs = []) => {
    const {
      id,
      onPick,
      getItemByTypeAndId,
      endPick
    } = this.props;
    const items = pickedRefs.map(ref => getItemByTypeAndId(ref.type, ref.id));
    if (items.length && onPick) {
      onPick(items);
      endPick(id);
    }
  };

  handleOnCancel = () => {
    const {
      id,
      endPick
    } = this.props;
    id && endPick && endPick(id);
  };

  handleSetPickerType = pickerType => {
    const { id, setPickerType } = this.props;
    id && pickerType && setPickerType && setPickerType(id, pickerType);
  };

  triggerPagination = () => {
    const { id, fetchPage, currentDirectoryLoadingState } = this.props;
    const { nodeOffset, leafOffset } = currentDirectoryLoadingState;
    id
      && ( nodeOffset >= 0 || leafOffset >= 0 )
      && fetchPage
      && fetchPage(id);
  };

  handleNodeSelection = event => {
    const { id, selectNode, fetchPage } = this.props;
    const nodeId = event.currentTarget.getAttribute('id');
    const type = event.currentTarget.getAttribute('type');
    const selectedNode = { id: nodeId, type };
    // Determine whether to "select" or "pick" the nodes
    if (type !== 'tdo') {
      id && nodeId && selectNode(id, [selectedNode]);
      id && fetchPage && fetchPage(id);
    } else {
      // Selected an item to open (tdo for now)
      this.handleOnPick([selectedNode]);
    }
  };

  handleCrumbSelection = crumb => {
    const { id, selectCrumb } = this.props;
    id && crumb && selectCrumb && selectCrumb(id, Number(crumb.index));
  };

  handleFilesSelected = fileOrFiles => {
    const {
      id,
      multiple,
      maxItems
    } = this.props;
    const {
      uploadedFiles
    } = this.state;

    const selectedFiles = isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    const totalFileCount = uploadedFiles.length + selectedFiles.length;
    if (multiple) {
      if (totalFileCount > maxItems) {
        // TODO: Exceeded max selection/uploads
      }
    } else {
      if (totalFileCount > 1) {
        // TODO: Exceeded max selection/uploads
      }
    }
    this.setState({
      uploadedFiles: [...uploadedFiles, ...selectedFiles]
    });
  };

  handleRemoveFile = index => {
    const {
      uploadedFiles
    } = this.state;
    if (uploadedFiles[index]) {
      const clonedFiles = uploadedFiles.slice();
      clonedFiles.splice(index, 1);
      this.setState({
        uploadedFiles: clonedFiles
      });
    }
  }

  handleUploadToTDO = () => {
    const {
      id,
      onPick,
      uploadToTDO
    } = this.props;
    const {
      uploadedFiles
    } = this.state;
    uploadToTDO && uploadToTDO(id, uploadedFiles, onPick);
    this.setState({ uploadedFiles: [] });
  };

  handleRetryDone = () => {
    // TODO: HOOKUP CALLBACK PROPERLY
    const {
      id,
      onPick,
      retryDone
    } = this.props;
    retryDone && retryDone(id, onPick);
  };

  handleRetry = () => {
    // TODO: HOOKUP CALLBACK PROPERLY
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
  };

  render() {
    const {
      currentDirectoryLoadingState,
      availablePickerTypes,
      enableFolders,
      enableStreams,
      enableUploads,
      itemRefs,
      getItemByTypeAndId
    } = this.props;
    const {
      uploadedFiles
    } = this.state;
    const useFolders = availablePickerTypes.includes('folder') && enableFolders;
    const useStreams = availablePickerTypes.includes('stream') && enableStreams;
    const useUploads = availablePickerTypes.includes('upload') && enableUploads;
    const items = itemRefs.map(item => getItemByTypeAndId(item.type, item.id));
    return (
      <Fragment>
        <Dialog open={this.props.open} classes={{
           paper: styles.dataPickerPaper
        }}>
          <DataPickerComponent
            {...this.props}
            items={items}

            isLoading={currentDirectoryLoadingState.isLoading}
            showFolder={useFolders}
            showStream={useStreams}
            showUpload={useUploads}
            uploadedFiles={uploadedFiles}
            onFilesSelected={this.handleFilesSelected}
            onRemoveFile={this.handleRemoveFile}
            onUpload={this.handleUploadToTDO}
            handleAbort={this.handleAbort}
            onRetryDone={this.handleRetryDone}
            retryRequest={this.handleRetry}
            setPickerType={this.handleSetPickerType}
            triggerPagination={this.triggerPagination}
            onCancel={this.handleOnCancel}
            onSelectItem={this.handleNodeSelection}
            onCrumbClick={this.handleCrumbSelection} />
        </Dialog>
        { this.props.renderButton &&
          this.props.renderButton({ handlePickFiles: this.handlePick })
        }
      </Fragment>
    );
  }
}

@connect(
  null,
  {
    pick: dataPickerModule.pick,
    endPick: dataPickerModule.endPick
  },
  null,
  { withRef: true }
)
class DataPickerWidgetComponent extends React.Component {
  static propTypes = {
    _widgetId: string.isRequired,
    pick: func.isRequired,
    endPick: func.isRequired
  };

  pickCallback = noop;

  pick = (callback = noop) => {
    this.pickCallback = callback;
    this.props.pick(this.props._widgetId);
  }

  cancel = () => {
    this.props.endPick(this.props._widgetId);
    this.callCancelledCallback();
  };

  callCancelledCallback = () => {
    this.pickCallback(null);
  };

  onPick = items => {
    this.pickCallback && this.pickCallback(items);
  }

  render() {
    return (
      <DataPicker
        id={this.props._widgetId}
        onPick={this.onPick}
        {...this.props}
      />
    );
  }
}

const DataPickerWidget = widget(DataPickerWidgetComponent);
export { DataPicker as default, DataPickerWidget };