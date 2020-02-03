import React, { Fragment } from 'react';
import { string, bool, oneOf, arrayOf, shape, number, func, any } from 'prop-types';
import { noop, get } from 'lodash';

import { connect } from 'react-redux';
import { withPropsOnChange } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/styles';

import { DataPicker as DataPickerComponent } from 'veritone-react-common';

import * as dataPickerModule from '../../redux/modules/dataPicker';
import * as filePickerModule from '../../redux/modules/filePicker';
import { guid } from '../../shared/util';
import widget from '../../shared/widget';

import styles from './styles';

/*
  Required parameters:
    onPick: (items) => { ... Logic to handle what you picked ... }
    enableFolders/enableUploads: bool (at least one of these are required)
    
    EITHER:
    open: bool (controlled component)
    renderButton

  Example usage:
  widget = new veritoneWidgets.DataPickerWidget({
    elId: YOUR_HTML_ELEMENT_ID,
    onPick: items => {
      console.log('Items picked: ');
      console.log(items);
    }
  });
  widget.pick(); // open Picker
  widget.cancel(); // close Picker
*/
@withStyles(styles)
@withPropsOnChange([], ({ id }) => ({
  id: id || guid()
}))
@connect(
  (state, { id }) => ({
    // General State
    internalState: dataPickerModule.isOpen(state, id),
    pathList: dataPickerModule.currentPath(state, id),
    availablePickerTypes: dataPickerModule.availablePickerTypes(state, id),
    currentPickerType: dataPickerModule.currentPickerType(state, id),
    itemRefs: dataPickerModule.currentDirectoryItems(state, id),
    currentDirectoryLoadingState: dataPickerModule.currentDirectoryLoadingState(
      state,
      id
    ),
    getItemByTypeAndId: dataPickerModule.getItemByTypeAndId(state),

    // Upload State
    percentByFiles: filePickerModule.percentByFiles(state, id),
    uploadPickerState: filePickerModule.state(state, id),
    uploadSuccess: filePickerModule.didSucceed(state, id),
    uploadError: filePickerModule.didError(state, id),
    uploadWarning: filePickerModule.didWarn(state, id),
    uploadStatusMsg: filePickerModule.statusMessage(state, id)
  }),
  {
    // General Actions
    pick: dataPickerModule.pick,
    endPick: dataPickerModule.endPick,
    setPickerType: dataPickerModule.setPickerType,
    fetchPage: dataPickerModule.fetchPage,
    selectNode: dataPickerModule.selectNode,
    selectCrumb: dataPickerModule.selectCrumb,

    // Upload Actions
    uploadToTDO: dataPickerModule.uploadToTDO,
    abortRequest: filePickerModule.abortRequest,
    retryRequest: dataPickerModule.retryRequest,
    retryDone: dataPickerModule.retryDone,

    // Search Actions
    setSearchValue: dataPickerModule.setSearchValue,
    clearSearch: dataPickerModule.clearSearch
  }
)
class DataPicker extends React.Component {
  static propTypes = {
    id: string.isRequired,
    fullScreen: bool,
    open: bool,
    internalState: bool,
    pick: func,
    onPick: func.isRequired,
    endPick: func.isRequired,
    abortRequest: func.isRequired,
    setPickerType: func.isRequired,
    selectCrumb: func.isRequired,
    onPickCancelled: func,
    enableFolders: bool,
    enableStreams: bool,
    enableUploads: bool,
    uploadToTDO: func.isRequired,
    retryDone: func.isRequired,
    retryRequest: func.isRequired,
    setSearchValue: func.isRequired,
    clearSearch: func.isRequired,
    renderButton: func,
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
        field: string, // Default 'name'
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
        type: oneOf(['folder', 'source', 'program', 'tdo']).isRequired,
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
      leafOffset: number,
      error: string
    }),
    fetchPage: func.isRequired,
    selectNode: func.isRequired,
    getItemByTypeAndId: func.isRequired,
    height: number,
    width: number,
    classes: shape({ any })
  };

  static defaultProps = {
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
    showError: false,
    errorMsg: ''
  };

  handlePick = () => {
    const {
      id,
      pick,
      enableFolders,
      enableStreams,
      enableUploads
    } = this.props;
    id &&
      pick &&
      pick(id, {
        enableFolders,
        enableStreams,
        enableUploads
      });
  };

  handleOnPick = (pickedRefs = []) => {
    const { id, onPick, getItemByTypeAndId, endPick } = this.props;
    const items = pickedRefs.map(ref => getItemByTypeAndId(ref.type, ref.id));
    if (items.length && onPick) {
      onPick(items);
      endPick(id);
    }
  };

  handleOnCancel = () => {
    const { id, abortRequest, endPick } = this.props;
    id && endPick && endPick(id);
    id && abortRequest && abortRequest(id);
  };

  handleSetPickerType = pickerType => {
    const { id, setPickerType } = this.props;
    id && pickerType && setPickerType && setPickerType(id, pickerType);
  };

  triggerPagination = () => {
    const { id, fetchPage, currentDirectoryLoadingState } = this.props;
    const { nodeOffset = 0, leafOffset = 0 } = currentDirectoryLoadingState;
    id && (nodeOffset >= 0 || leafOffset >= 0) && fetchPage && fetchPage(id);
  };

  handleNodeSelection = (selectedNodes = []) => {
    const { id, selectNode, fetchPage } = this.props;
    // Don't do anything if mixed types are present
    const mixedSelection =
      Object.keys(
        selectedNodes.reduce((acc, node) => {
          acc[node.type] = true;
          return acc;
        }, {})
      ).length > 1;
    if (mixedSelection || !selectedNodes.length) {
      return;
    }
    const type = get(selectedNodes, '[0].type');
    // Determine whether to "select" or "pick" the nodes
    if (type !== 'tdo' && selectedNodes.length === 1) {
      id && selectNode && selectNode(id, selectedNodes);
      id && fetchPage && fetchPage(id);
    } else if (type === 'tdo') {
      // Selected an item to open (tdo for now)
      this.handleOnPick(selectedNodes);
    }
  };

  handleCrumbSelection = crumb => {
    const { id, selectCrumb } = this.props;
    id && crumb && selectCrumb && selectCrumb(id, Number(crumb.index));
  };

  handleUploadToTDO = (uploadedFiles = []) => {
    const { id, onPick, uploadToTDO } = this.props;
    uploadToTDO && uploadToTDO(id, uploadedFiles, onPick);
  };

  handleRetryDone = () => {
    const { id, onPick, retryDone } = this.props;
    retryDone && retryDone(id, onPick);
  };

  handleRetry = () => {
    const { id, retryRequest, onPick } = this.props;
    retryRequest && retryRequest(id, onPick);
  };

  handleAbort = fileKey => {
    const { id, abortRequest } = this.props;
    abortRequest && abortRequest(id, fileKey);
  };

  handleOnSearch = searchValue => {
    const { id, setSearchValue } = this.props;
    setSearchValue && setSearchValue(id, searchValue);
  };

  handleOnClear = () => {
    const { clearSearch } = this.props;
    clearSearch && clearSearch();
  };

  handleShowErrorMsg = errorMsg => () => {
    this.setState({
      showError: true,
      errorMsg
    });
  };

  handleCloseErrorMsg = () => {
    this.setState({
      showError: false,
      errorMsg: ''
    });
  };

  render() {
    const {
      currentDirectoryLoadingState,
      itemRefs,
      getItemByTypeAndId,
      classes,
      height = 1,
      width = 1
    } = this.props;
    const { showError, errorMsg } = this.state;
    const { open, internalState, fullScreen } = this.props;
    const items = itemRefs.map(item => getItemByTypeAndId(item.type, item.id));
    const dimensionOverride = fullScreen
      ? {}
      : {
        height,
        width
      };

    const openState = open === undefined ? internalState : open;
    return (
      <Fragment>
        <Dialog
          open={openState || false}
          fullScreen={fullScreen}
          classes={{ paper: classes.dataPickerPaper }}
          PaperProps={{ style: dimensionOverride }}
        >
          <DataPickerComponent
            {...this.props}
            items={items}
            onErrorMsg={this.handleShowErrorMsg}
            isError={currentDirectoryLoadingState.error}
            isLoading={currentDirectoryLoadingState.isLoading}
            isLoaded={currentDirectoryLoadingState.isLoaded}
            onUpload={this.handleUploadToTDO}
            handleAbort={this.handleAbort}
            onRetryDone={this.handleRetryDone}
            retryRequest={this.handleRetry}
            setPickerType={this.handleSetPickerType}
            triggerPagination={this.triggerPagination}
            onCancel={this.handleOnCancel}
            onSelectItem={this.handleNodeSelection}
            onCrumbClick={this.handleCrumbSelection}
            onSearch={this.handleOnSearch}
            onClear={this.handleOnClear}
          />
        </Dialog>
        {this.props.renderButton &&
          this.props.renderButton({ handlePickFiles: this.handlePick })}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={showError}
          autoHideDuration={5000}
          onClose={this.handleCloseErrorMsg}
        >
          <SnackbarContent
            className={classes.dataPickerErrorSnack}
            message={errorMsg}
            action={[
              <IconButton key="close-btn" onClick={this.handleCloseErrorMsg}>
                <CloseIcon />
              </IconButton>
            ]}
          />
        </Snackbar>
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
  { forwardRef: true }
)
class DataPickerWidgetComponent extends React.Component {
  static propTypes = {
    _widgetId: string.isRequired,
    pick: func.isRequired,
    endPick: func.isRequired,
    enableFolders: bool,
    enableStreams: bool,
    enableUploads: bool
  };

  pickCallback = noop;

  pick = (callback = noop) => {
    const {
      _widgetId,
      pick,
      enableFolders,
      enableStreams,
      enableUploads
    } = this.props;
    this.pickCallback = callback;
    pick &&
      pick(_widgetId, {
        enableFolders,
        enableStreams,
        enableUploads
      });
  };

  cancel = () => {
    this.props.endPick(this.props._widgetId);
    this.callCancelledCallback();
  };

  callCancelledCallback = () => {
    this.pickCallback(null);
  };

  onPick = items => {
    this.pickCallback && this.pickCallback(items);
  };

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
