import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { object, func, bool } from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styles from './styles.scss';

class EditMetadataDialog extends Component {
  static propTypes = {
    metadata: object,
    isOpen: bool,
    onSave: func,
    onClose: func
  };

  state = {
    filename:
      (this.props.metadata.veritoneFile &&
        this.props.metadata.veritoneFile.filename) ||
      '',
    source:
      (this.props.metadata.veritoneCustom &&
        this.props.metadata.veritoneCustom.source) ||
      '',
    programLiveImage:
      (this.props.metadata.veritoneProgram &&
        this.props.metadata.veritoneProgram.programLiveImage) ||
      '',
    programImage:
      (this.props.metadata.veritoneProgram &&
        this.props.metadata.veritoneProgram.programImage) ||
      ''
  };

  onFileNameChange = event => {
    this.setState({
      filename: event.target.value
    });
  };

  onSourceChange = event => {
    this.setState({
      source: event.target.value
    });
  };

  onProgramLiveImageChange = event => {
    this.setState({
      programLiveImage: event.target.value
    });
  };

  onProgramImageChange = event => {
    this.setState({
      programImage: event.target.value
    });
  };

  onSave = () => {
    const metadataToUpdate = {};
    if (this.isFileNameChanged()) {
      metadataToUpdate.veritoneFile = {};
      metadataToUpdate.veritoneFile.filename = this.state.filename;
    }
    if (this.isSourceChanged()) {
      metadataToUpdate.veritoneCustom = {};
      metadataToUpdate.veritoneCustom.source = this.state.source;
    }
    if (this.isProgramLiveImageChanged()) {
      metadataToUpdate.veritoneProgram = {};
      metadataToUpdate.veritoneProgram.programLiveImage = this.state.programLiveImage;
    }
    if (this.isProgramImageChanged()) {
      metadataToUpdate.veritoneProgram = {};
      metadataToUpdate.veritoneProgram.programImage = this.state.programImage;
    }
    this.props.onSave(metadataToUpdate);
  };

  isFileNameChanged = () => {
    return (
      this.state.filename &&
      this.state.filename.length &&
      this.state.filename !== this.props.metadata.veritoneFile.filename
    );
  };

  isSourceChanged = () => {
    const sourceChanged =
      this.state.source &&
      (!this.props.metadata.veritoneCustom ||
        !this.props.metadata.veritoneCustom.source ||
        this.state.source !== this.props.metadata.veritoneCustom.source);
    return !!sourceChanged;
  };

  isProgramLiveImageChanged = () => {
    return (
      this.state.programLiveImage &&
      this.state.programLiveImage.length &&
      (!this.props.metadata.veritoneProgram ||
        !this.props.metadata.veritoneProgram.programLiveImage ||
        this.state.programLiveImage !==
          this.props.metadata.veritoneProgram.programLiveImage)
    );
  };

  isProgramImageChanged = () => {
    return (
      this.state.programImage &&
      this.state.programImage.length &&
      (!this.props.metadata.veritoneProgram ||
        !this.props.metadata.veritoneProgram.programImage ||
        this.state.programImage !==
          this.props.metadata.veritoneProgram.programImage)
    );
  };

  hasPendingChanges = () => {
    return (
      this.isFileNameChanged() ||
      this.isSourceChanged() ||
      this.isProgramLiveImageChanged() ||
      this.isProgramImageChanged()
    );
  };

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.props.onClose}
        aria-labelledby="edit-metadata-dialog"
        classes={{
          root: styles.editMetadataDialog,
          paper: styles.editMetadataDialogPaper
        }}
      >
        <DialogTitle id="edit-metadata-dialog">Edit Metadata</DialogTitle>
        <DialogContent>
          <div className={styles.dialogContent}>
            <TextField
              autoFocus
              margin="dense"
              id="filename"
              label="Filename"
              value={this.state.filename}
              onChange={this.onFileNameChange}
              fullWidth
            />
            <TextField
              margin="dense"
              id="source"
              className={styles.sourceSection}
              label="Source"
              placeholder="Enter name of media owner or creator"
              value={this.state.source}
              onChange={this.onSourceChange}
              fullWidth
            />
            <div className={styles.programImagesSection}>
              <div>
                Program Live Image
                {this.state.programLiveImage &&
                  this.state.programLiveImage.length && (
                    <img
                      className={styles.programLiveImage}
                      src={this.state.programLiveImage}
                    />
                  )}
                {(!this.state.programLiveImage ||
                  !this.state.programLiveImage.length) && (
                  <img
                    className={styles.programLiveImage}
                    src="//static.veritone.com/veritone-ui/default-nullstate.svg"
                  />
                )}
              </div>
              <div>
                Program Image
                {this.state.programImage &&
                  this.state.programImage.length && (
                    <img
                      className={styles.programImage}
                      src={this.state.programImage}
                    />
                  )}
                {(!this.state.programImage ||
                  !this.state.programImage.length) && (
                  <img
                    className={styles.programImage}
                    src="//static.veritone.com/veritone-ui/program_image_null.svg"
                  />
                )}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={this.onSave}
            color="primary"
            disabled={!this.hasPendingChanges()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditMetadataDialog);
