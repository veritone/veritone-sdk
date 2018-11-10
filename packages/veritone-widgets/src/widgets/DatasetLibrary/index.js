import React from 'react';
import { func, string, arrayOf, shape } from 'prop-types';

import { get } from 'lodash';

import { LibraryForm } from 'veritone-react-common';
import { connect } from 'react-redux';
import widget from '../../shared/widget';
import { Status } from '../../redux/modules/datasetLibrary';
import * as Actions from '../../redux/modules/datasetLibrary/actionCreator';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import AddTDOsPanel from './AddTDOsPanel';
import styles from './styles.scss';

const connectWrapper = connect(
  state => ({
    libraries: get(state, [Actions.namespace, 'libraries'], []),
    libraryTypes: get(state, [Actions.namespace, 'libraryTypes'], []),
    alertMessage: get(state, [Actions.namespace, 'alertMessage']),
    tdoStatus: get(state, [Actions.namespace, 'tdoStatus']),
    libraryStatus: get(state, [Actions.namespace, 'libraryStatus']),
    libraryTypeStatus: get(state, [Actions.namespace, 'libraryTypeStatus'])
  }),
  { 
    addTdos: Actions.addTdos,
    resetTdos: Actions.resetTdos,
    createLibrary: Actions.createLibrary,
    loadLibraries: Actions.loadLibraries,
    loadLibraryTypes: Actions.loadLibraryTypes,
  },
  null,
  { withRef: true }
);

@connectWrapper
class DatasetLibrary extends React.Component {
  static propTypes = {
    tdoIds: arrayOf(string).isRequired,
    onClosed: func,

    addDatasetTitle: string,
    libraries: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),

    createLibraryTitle: string,
    libraryTypes: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),

    addTdos: func.isRequired,
    resetTdos: func.isRequired,
    createLibrary: func.isRequired,
    loadLibraries: func,
    loadLibraryTypes: func,
    alertMessage: string,
    tdoStatus: string,
    libraryStatus: string,
    libraryTypeStatus: string,
  };

  static defaultProps = {
    addDatasetTitle: 'Add to Library Dataset',
    createLibraryTitle: 'Create New Library',
    libraries: [],
    libraryTypes: []
  };

  state = {
    open: true,
    alert: false,
    createLibView: false,
    tdoStatus: Status.INITIAL,
    libraryStatus: Status.INITIAL,
    libraryTypeStatus: Status.INITIAL
  };

  static getDerivedStateFromProps(props, state) {
    const {
      libraries, 
      libraryTypes,
      loadLibraries, 
      loadLibraryTypes, 
      tdoStatus,
      libraryStatus,
      libraryTypeStatus
    } = props;

    const newState = {
      ...state,
      tdoStatus: tdoStatus,
      libraryStatus: libraryStatus,
      libraryTypeStatus: libraryTypeStatus
    }    
    if (!state.createLibView) {
      if (!libraries || libraries.length === 0) {
        if (libraryStatus === Status.INITIAL) {
          loadLibraries();
        } else if (libraryStatus === Status.ERROR && state.libraryStatus !== Status.ERROR) {
          console.log('library status error');
          return {...newState, alert: true}
        } else if (libraryStatus === Status.LOADED) {
          return {...newState, createLibView: true}
        } 
      }
    } else {
      if (libraryStatus === Status.CREATED) {
        return {...newState, createLibView: false}
      } else if (!libraryTypes || libraryTypes.length === 0) {
        if (libraryTypeStatus === Status.INITIAL) {
          loadLibraryTypes();
        } else if (libraryTypeStatus === Status.ERROR && state.libraryTypeStatus !== Status.ERROR) {
          console.log('library type status error');
          return {...newState, alert: true}
        }
      }
    }

    if (tdoStatus === Status.ADDED) {
      return { ...newState, open: false };
    } else if (tdoStatus === Status.ERROR && state.tdoStatus !== Status.ERROR) {
      console.log('tdos status error');
      return {...newState, alert: true}
    }

    return null;
  }

  componentDidMount () {
    const {loadLibraries} = this.props;
    loadLibraries && loadLibraries();
  }

  //----Create New Library Handlers----
  handleCancelLibraryCreation = () => {
    this.setState({ createLibView: false });
  }

  handleCreateNewLibrary = (newLib) => {
    const { createLibrary } = this.props;
    createLibrary && createLibrary(
      newLib.libraryName, 
      newLib.libraryTypeId,
      newLib.description,
      newLib.coverImage
    );
  }

  //----Add to Dataset Handlers----
  handleCancel = () => {
    this.setState({ open: false });
  }

  showCreateNewLibraryPanel = () => {
    const {
      libraryTypes, 
      loadLibraryTypes 
    } = this.props;
    (!libraryTypes || libraryTypes.length === 0) && loadLibraryTypes();
    this.setState({ createLibView: true });
  }

  handleAddToDataset = (selectedLib) => {
    const { tdoIds, addTdos } = this.props;
    addTdos(tdoIds, selectedLib.id)
  }

  handleExited = () => {
    this.props.onClosed && this.props.onClosed();
  }

  //----Error Handlers----
  handleCloseAlert = () => {
    const { tdoStatus, resetTdos } = this.props;
    this.setState({
      alert: false
    });

    (tdoStatus === Status.ERROR) && resetTdos();
  }

  render() {
    const {
      addDatasetTitle,
      createLibraryTitle,
      libraries,
      libraryTypes,
      alertMessage,
      tdoStatus,
      libraryStatus,
      libraryTypeStatus
    } = this.props;

    const {
      open,
      alert,
      createLibView
    } = this.state;

    return (
      <Dialog
        open={open}
        onClose={this.handleCancel}
        onExited={this.handleExited}
        aria-labelledby="dataset-title"
        className={styles.datasetLibraryWidget}
      >
        <DialogTitle 
          disableTypography
          id="dataset-title"
          className={styles.title}
        >
          {createLibView ? createLibraryTitle : addDatasetTitle}
        </DialogTitle>
        <DialogContent className={styles.content}>
          {
            createLibView ?
            <LibraryForm 
              libraryTypes={libraryTypes}
              onSubmit={this.handleCreateNewLibrary}
              onCancel={(libraries && libraries.length > 0) ? this.handleCancelLibraryCreation : this.handleCancel}
            /> :
            <AddTDOsPanel 
              className={styles.AddTDOsPanel}
              datasetLibraries={libraries}
              onCancel={this.handleCancel}
              onAddToDataset={this.handleAddToDataset}
              onCreateNewDataset={this.showCreateNewLibraryPanel}
            />
          }
          <Snackbar
            open={alert}
            autoHideDuration={3000}
            className={styles.snackbar}
            onClose={this.handleCloseAlert}
          >
            <SnackbarContent
              className={styles.content}
              message={
                <span className={styles.message}>
                  <ErrorIcon className={styles.statusIcon} />
                  {alertMessage}
                </span>
              }
              action={[
                <IconButton key="close" aria-label="Close" color="inherit" onClick={this.handleCloseAlert}>
                  <CloseIcon />
                </IconButton>,
              ]}
            />
          </Snackbar>
        </DialogContent>
        {
          (
            tdoStatus === Status.ADDING || 
            libraryStatus === Status.LOADING ||
            libraryStatus === Status.CREATING ||
            libraryTypeStatus === Status.LOADING
          ) &&
          <div className={styles.progress}>
            <CircularProgress size={60}/>
          </div>
        }
      </Dialog>
    );
  }
}

const DatasetLibraryWidget = widget(DatasetLibrary);
export { DatasetLibrary as default, DatasetLibraryWidget };
