import React, { Component } from 'react';
import { arrayOf, shape, number, string, bool, func } from 'prop-types';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import NoFacesFound from '../NoFacesFound';
import FaceDetectionBox from '../FaceDetectionBox';

import styles from './styles.scss';

class FaceGrid extends Component {
  static propTypes = {
    faces: arrayOf(
      shape({
        startTimeMs: number,
        endTimeMs: number,
        object: shape({
          label: string,
          originalImage: string
        })
      })
    ),
    entitySearchResults: arrayOf(
      shape({
        entityName: string,
        libraryName: string,
        profileImageUrl: string
      })
    ),
    editMode: bool,
    onAddNewEntity: func,
    onEditFaceDetection: func,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
    onSearchForEntities: func
  };

  state = {
    dialogOpen: false,
    selectedFace: null,
    selectedEntity: null
  }

  handleFaceClick = face => evt => {
    if (!this.props.editMode) {
      this.props.onFaceOccurrenceClicked(face.startTimeMs, face.stopTimeMs);
    }
  };

  handleAddNewEntity = (faceIdx) => (face, entity) => {
    this.props.onAddNewEntity(face);
    // return this.setState({
    //   dialogOpen: true,
    //   selectedFace: faceIdx,
    //   selectedEntity: entity
    // });
  }

  closeDialog = () => {
    this.setState({ dialogOpen: false });
  }

  renderNewEntityModal = () => {
    return (
      <Dialog
        open={this.state.dialogOpen}
        onClose={this.closeDialog}
        aria-labelledby="new-entity-title"
        disableBackdropClick
      >
        <DialogTitle id="new-entity-title">Add New</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Identify and help train face recognition engines to find this individual. You can view and add additional images in the Library application.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={this.closeDialog} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {
    const { faces } = this.props;

    return (
      <div className={styles.faceGrid}>
        {!faces.length
          ? <NoFacesFound />
          : faces.map((face, idx) => {
            return (
              <FaceDetectionBox
                key={
                  `face-${face.startTimeMs}-${face.stopTimeMs}-
                  ${face.object.label}-${face.object.originalImage}`
                }
                face={face}
                enableEdit={this.props.editMode}
                // addNewEntity={this.props.onAddNewEntity}
                addNewEntity={this.handleAddNewEntity(idx)}
                searchResults={this.props.entitySearchResults}
                onEditFaceDetection={this.props.onEditFaceDetection}
                onRemoveFaceDetection={this.props.onRemoveFaceDetection}
                onClick={this.handleFaceClick(face)}
                onSearchForEntities={this.props.onSearchForEntities}
              />
            );
          })
        }
        {this.renderNewEntityModal()}
      </div>
    );
  }
}

export default FaceGrid;
