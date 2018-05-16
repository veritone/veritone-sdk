import React, { Component, Fragment } from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { objectOf, func, bool, any } from 'prop-types';
import { get } from 'lodash';
import { withStyles } from 'material-ui/styles';
import FilePicker from 'components/FilePicker';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './styles.scss';

@withMuiThemeProvider
class EditMetadataDialog extends Component {
  static propTypes = {
    metadata: objectOf(any),
    isOpen: bool,
    onSave: func,
    onClose: func
  };

  state = {
    filename: get(this.props.metadata, 'veritoneFile.filename', ''),
    source: get(this.props.metadata, 'veritoneCustom.source', ''),
    programLiveImage: get(
      this.props.metadata,
      'veritoneProgram.programLiveImage'
    ),
    programImage: get(this.props.metadata, 'veritoneProgram.programImage'),
    selectingFile: false
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
    let metadataToUpdate = {};
    const { filename, source } = this.state;
    if (filename !== get(this.props.metadata, 'veritoneFile.filename', '')) {
      metadataToUpdate.veritoneFile = {};
      metadataToUpdate.veritoneFile.filename = this.state.filename;
    }
    if (source !== get(this.props.metadata, 'veritoneCustom.source', '')) {
      metadataToUpdate.veritoneCustom = {};
      metadataToUpdate.veritoneCustom.source = this.state.source;
    }
    metadataToUpdate = {
      ...metadataToUpdate,
      veritoneProgram: {
        ...metadataToUpdate.veritoneProgram,
        programLiveImage: this.state.programLiveImageFile || this.state.programLiveImage,
        programImage: this.state.programImageFile || this.state.programImage
      }
    }
    this.props.onSave(metadataToUpdate);
  };

  hasPendingChanges = () => {
    const { filename, source, programLiveImage, programImage } = this.state;
    return (
      filename !== get(this.props.metadata, 'veritoneFile.filename', '') ||
      source !== get(this.props.metadata, 'veritoneCustom.source', '') ||
      programLiveImage !== get(
        this.props.metadata,
        'veritoneProgram.programLiveImage'
      )  ||
      programImage !== get(
        this.props.metadata,
        'veritoneProgram.programImage'
      )
    );
  };

  handleStartPickFiles = fileType => event => {
    this.setState({
      selectingFile: true,
      selectImageType: fileType
    });
  };

  handleFilesSelected = files => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.setState((prevState, props) => {
        return {
          [prevState.selectImageType]: fileReader.result,
          [prevState.selectImageType + 'File']: files[0],
          selectingFile: false,
          selectImageType: null
        };
      });
    };

    fileReader.readAsDataURL(files[0]);
  };

  handleCloseFilePicker = () => {
    this.setState({
      selectingFile: false,
      selectImageType: null
    });
  };

  handleRemoveImage = imageType => event => {
    this.setState({
      [imageType]: '',
      [imageType + 'File']: null
    })
  }

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.props.onClose}
        aria-labelledby="edit-metadata-dialog"
        classes={{
          paper: styles.editMetadataDialogPaper
        }}
      >
        {this.state.selectingFile && (
          <FilePicker
            accept="image/*"
            allowUrlUpload={false}
            onRequestClose={this.handleCloseFilePicker}
            onPickFiles={this.handleFilesSelected}
            width={640}
            height={482}
          />
        )}
        {!this.state.selectingFile && (
          <Fragment>
            <DialogTitle
              classes={{
                root: styles.dialogTitle
              }}
            >
              <div className={styles.dialogTitleLabel}>Edit Metadata</div>
              <IconButton
                onClick={this.props.onClose}
                aria-label="Close"
                classes={{
                  root: styles.closeButton
                }}
              >
                <Icon className="icon-close-exit" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="normal"
                id="filename"
                label="Filename"
                InputLabelProps={{
                  shrink: true
                }}
                value={this.state.filename}
                onChange={this.onFileNameChange}
                fullWidth
                classes={{
                  root: styles.textInput
                }}
              />
              <TextField
                margin="normal"
                id="source"
                className={styles.sourceSection}
                label="Source"
                placeholder="Enter name of media owner or creator"
                InputLabelProps={{
                  shrink: true
                }}
                value={this.state.source}
                onChange={this.onSourceChange}
                fullWidth
                classes={{
                  root: styles.textInput
                }}
              />
              <div className={styles.programImagesSection}>
                <div
                  className={styles.imageSection}
                >
                  <div className={styles.programImageLabel}>
                    Program Live Image
                  </div>
                  <div className={styles.programLiveImageContainer}>
                    <img className={styles.programLiveImage}
                      src={
                        get(this.state, 'programLiveImage.length') ?
                          this.state.programLiveImage :
                          "//static.veritone.com/veritone-ui/default-nullstate.svg"
                      }
                    />
                    <div className={styles.imageOverlay}>
                      <EditIcon classes={{root:styles.editProgramLiveImageIcon}} className="icon-mode_edit2" onClick={this.handleStartPickFiles('programLiveImage')}/>
                      { !!get(this.state, 'programLiveImage.length') && <DeleteIcon classes={{root:styles.editProgramLiveImageIcon}} className="icon-trashcan" onClick={this.handleRemoveImage('programLiveImage')}/>}
                    </div>
                  </div>
                </div>
                <div
                  className={styles.imageSection}
                >
                  <div className={styles.programImageLabel}>Program Image</div>
                  <div className={styles.programImageContainer}>
                    <img className={styles.programImage}
                      src={ 
                        get(this.state, 'programImage.length') ?
                          this.state.programImage :
                          "//static.veritone.com/veritone-ui/program_image_null.svg"
                      }
                    />
                    <div className={styles.imageOverlay}>
                      <EditIcon classes={{root:styles.editProgramImageIcon}} className="icon-mode_edit2" onClick={this.handleStartPickFiles('programImage')}/>
                      { !!get(this.state, 'programImage.length') && <DeleteIcon classes={{root:styles.editProgramImageIcon}} onClick={this.handleRemoveImage('programImage')}/> }
                    </div>
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
          </Fragment>
        )}
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditMetadataDialog);
