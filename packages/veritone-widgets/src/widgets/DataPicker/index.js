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
import { noop } from 'lodash';

import { connect } from 'react-redux';
import { withPropsOnChange } from 'recompose';

import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';

import { DataPicker as DataPickerComponent } from 'veritone-react-common';

import * as dataPickerModule from '../../redux/modules/dataPicker';
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
    items: dataPickerModule.currentDirectoryItems(state, id),
    currentDirectoryLoadingState: dataPickerModule.currentDirectoryLoadingState(state, id)
  }),
  {
    pick: dataPickerModule.pick,
    endPick: dataPickerModule.endPick,
    fetchPage: dataPickerModule.fetchPage,
    selectNodes: dataPickerModule.selectNodes,
    selectCrumb: dataPickerModule.selectCrumb
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
    acceptedFileTypes: arrayOf(string),
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
    selectNodes: func.isRequired
  };

  static defaultProps = {
    open: false,
    onPick: noop,
    onPickCancelled: noop,
    currentDirectoryLoadingState: {
      isLoading: false,
      nodeOffset: -1,
      leafOffset: -1
    }
  };

  handlePick = () => {
    const { id, pick } = this.props;
    id && pick && pick(id);
  };

  triggerPagination = () => {
    const { id, fetchPage, currentDirectoryLoadingState } = this.props;
    const { nodeOffset, leafOffset } = currentDirectoryLoadingState;
    id
      && nodeOffset >= 0
      && leafOffset >= 0
      && fetchPage
      && fetchPage(id);
  };

  handleNodeSelection = event => {
    const { id, selectNodes, fetchPage } = this.props;
    const nodeId = event.currentTarget.getAttribute('id');
    const type = event.currentTarget.getAttribute('type');
    id && nodeId && selectNodes(id, [{ id: nodeId, type }]);
    id && fetchPage && fetchPage(id);
  };

  handleCrumbSelection = crumb => {
    const { id, selectCrumb } = this.props;
    id && crumb && selectCrumb && selectCrumb(id, Number(crumb.index));
  }

  render() {
    const { currentDirectoryLoadingState } = this.props;
    return (
      <Fragment>
        <Dialog open={this.props.open} styles={{ maxWidth: 'none', maxHeight: 'none' }}>
          <DataPickerComponent
            {...this.props}
            isLoading={currentDirectoryLoadingState.isLoading}
            triggerPagination={this.triggerPagination}
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
    this.pickCallback(null, { cancelled: true });
  };

  render() {
    return (
      <DataPicker
        id={this.props._widgetId}
        {...this.props}
      />
    );
  }
}

const DataPickerWidget = widget(DataPickerWidgetComponent);
export { DataPicker as default, DataPickerWidget };