import React, { Component } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { get } from 'lodash';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Icon from '@material-ui/core/Icon/Icon';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import Dialog from '@material-ui/core/Dialog/Dialog';
import AddNewEntityForm from './AddNewEntityForm';
import connect from 'react-redux/es/connect/connect';
import * as faceEngineOutput from '../../../redux/modules/mediaDetails/faceEngineOutput';
import { removeAwsSignatureParams } from '../../../shared/asset';
import { LibraryForm } from 'veritone-react-common';

import styles from './styles.scss';

@connect(
  state => ({
    open: faceEngineOutput.getAddNewEntityDialogOpen(state),
    isFetchingLibraries: faceEngineOutput.isFetchingLibraries(state),
    libraries: faceEngineOutput.getLibraries(state),
    currentlyEditedFaces: faceEngineOutput.getCurrentlyEditedFaces(state)
  }),
  {
    fetchLibraries: faceEngineOutput.fetchLibraries,
    createEntity: faceEngineOutput.createEntity,
    createNewLibrary: faceEngineOutput.createNewLibrary
  },
  null,
  { withRef: true }
)
export default class AddNewEntityDialog extends Component {
  static propTypes = {
    open: bool,
    libraries: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    fetchLibraries: func.isRequired,
    isFetchingLibraries: bool,
    createEntity: func,
    onSubmit: func,
    onCancel: func,
    currentlyEditedFaces: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        object: shape({
          label: string,
          uri: string,
          entityId: string,
          libraryId: string
        })
      })
    ),
    createNewLibrary: func
  };

  state = {
    selectedLibraryId: null,
    configuringNewLibrary: false
  };

  componentDidMount() {
    if (!get(this.props, 'libraries.length')) {
      this.props.fetchLibraries({
        libraryType: 'people'
      });
    }
  }

  handleSubmit = formData => {
    const { currentlyEditedFaces } = this.props;
    this.props
      .createEntity({
        ...formData,
        profileImageUrl: removeAwsSignatureParams(
          get(currentlyEditedFaces, '[0].object.uri')
        )
      })
      .then(res => {
        if (currentlyEditedFaces) {
          this.props.onSubmit(currentlyEditedFaces, res.entity);
        }
        return res;
      });
  };

  handleNewLibraryClick = () => {
    this.setState({
      configuringNewLibrary: true
    });
  };

  handleCreateLibrary = library => {
    this.props.createNewLibrary(library).then(res => {
      this.setState({
        configuringNewLibrary: false,
        selectedLibraryId: get(res, 'createLibrary.id')
      });
      return res;
    });
  };

  render() {
    const { libraries, isFetchingLibraries, onCancel } = this.props;
    const initialLibraryId =
      this.state.selectedLibraryId || get(libraries, '[0].id');
    return (
      <Dialog
        open={this.props.open}
        classes={{
          paper: styles.editNewEntityDialogPaper
        }}
      >
        <DialogTitle
          id="add-new-entity-title"
          classes={{
            root: styles.dialogTitle
          }}
        >
          <div className={styles.dialogTitleLabel}>{'Create New Entity'}</div>
          <IconButton
            onClick={this.props.onCancel}
            aria-label="Close Add New Entity"
            classes={{
              root: styles.closeButton
            }}
          >
            <Icon className="icon-close-exit" />
          </IconButton>
        </DialogTitle>
        <DialogContent className={styles.addEntityContent}>
          <DialogContentText
            classes={{
              root: styles.dialogHintText
            }}
          >
            Identify and help train face recognition engines to find this
            individual. You can view and add additional images in the Library
            application.
          </DialogContentText>
          {!this.state.configuringNewLibrary && (
            <AddNewEntityForm
              isFetchingLibraries={isFetchingLibraries}
              libraries={libraries}
              initialValues={{
                libraryId: initialLibraryId
              }}
              showCreateLibraryButton
              onCreateNewLibrary={this.handleNewLibraryClick}
              onSubmit={this.handleSubmit}
              onCancel={onCancel}
            />
          )}
          {this.state.configuringNewLibrary && (
            <LibraryForm
              initialValues={{ libraryTypeId: 'people' }}
              libraryTypes={[{ id: 'people', name: 'People' }]}
              onSubmit={this.handleCreateLibrary}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }
}
