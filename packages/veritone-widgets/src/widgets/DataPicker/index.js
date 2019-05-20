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

import {
  HeaderBar,
  InfiniteDirectoryList
} from 'veritone-react-common';

import * as dataPickerModule from '../../redux/modules/dataPicker';
import { guid } from '../../shared/util';
import widget from '../../shared/widget';

import styles from './styles.scss';

@withPropsOnChange([], ({ id }) => ({
  id: id || guid()
}))
@connect(
  (state, { id }) => ({
    open: dataPickerModule.isOpen(state, id)
  }),
  {
    pick: dataPickerModule.pick
  }
)
class DataPicker extends React.Component {
  static propTypes = {
    id: string.isRequired,
    open: bool,
    enableFolders: bool,
    enableStreams: bool,
    enableUploads: bool,
    multiple: bool,
    acceptedFileTypes: arrayOf(string),
    onPickData: func.isRequired,
    currentPickerType: oneOf('folder', 'stream', 'upload'),
    currentViewType: oneOf('list', 'grid'),
    folderData: shape({
        currentPath: arrayOf(string),
        sortCriteria: arrayOf(
          shape({
            field: string,                  // Default 'name'
            direction: oneOf('asc', 'desc') // Default 'asc'
          })
        ),
        treeItems: shape({
            id: string.isRequired,
            type: string.isRequired,            // This will be 'folder' since root folder doesn't have childTdos
            name: string.isRequired,
            createdDateTime: string.isRequired,
            modifiedDateTime: string.isRequired,
            nodeItems: arrayOf(any),        // This is a recursive structure containing more "treeItems"
            leafItems: arrayOf(
              shape({
                id: string.isRequired,
                type: string.isRequired,    // This will be 'tdo'
                name: string.isRequired,
                primaryAsset: shape({
                    contentType: string.isRequired,
                    jsondata: shape(any).isRequired,
                    signedUri: string
                }),
                streams: shape({
                    uri: string,
                    protocol: string
                }),
                createdDateTime: string.isRequired,
                modifiedDateTime: string.isRequired
              })
            ),
            nodeOffset: number,             // Default 0, reference to the page for folder query
            leafOffset: number,             // Default 0, reference to the page for childTDO query
            isLoading: bool
        })
    }),
    streamData: shape({                           // Ignore this for MVP
        currentPath: arrayOf(string),
        sortCriteria: arrayOf(
          shape({
            field: string,                  // Default 'name'
            direction: oneOf('asc', 'desc') // Default 'asc'
          })
        ),
        treeItems: shape({
            sourceId: string,
            createdDateTime: string.isRequired,
            modifiedDateTime: string.isRequired,
            nodeItems: arrayOf(any),        // Will contain sources and programs/scheduledJobs
            leafItems: arrayOf(
              shape({      // Will only be populated within programs/scheduledJobs
                tdoId: string.isRequired,
                name: string.isRequired,
                primaryAsset: shape({
                    contentType: string.isRequired,
                    jsondata: shape(any).isRequired,
                    signedUri: string
                }),
                streams: shape({
                    uri: string,
                    protocol: string
                }),
                createdDateTime: string.isRequired,
                modifiedDateTime: string.isRequired
              })
            ),
            nodeOffset: number,             // Default 0, reference to the page for folder query
            leafOffset: number,             // Default 0, reference to the page for childTDO query
            isLoading: bool
        })
    }),
    uploadData: shape({
      files: arrayOf(
        shape({
          fileName: string.isRequired,
          size: number.isRequired,
          type: string.isRequired,
          unsignedUrl: string.isRequired,
          getUrl: string.isRequired
        })
      ),
    })
  };

  static defaultProps = {
    open: false,
    onPick: noop,
    onPickCancelled: noop,
    height: 450,
    width: 600
  };

  handlePick = () => {
    this.props.pick(this.props.id);
  }

  render() {
    return (
      <Fragment>
        <Dialog open={this.props.open}>
          <Grid className={styles.dataPicker} container>
            <Grid item>
              {'TEST'}
            </Grid>
            <Grid item>
              {'TEST'}
            </Grid>
          </Grid>
        </Dialog>
        { this.props.renderButton &&
          this.props.renderButton({ handlePickFiles: this.handlePick })
        }
      </Fragment>
    );
  }
}

class DataPickerWidgetComponent extends React.Component {
  static propTypes = {
    _widgetId: string.isRequired,
    pick: func.isRequired,
    endPick: func.isRequired,
    pickCallback: func.isRequired
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