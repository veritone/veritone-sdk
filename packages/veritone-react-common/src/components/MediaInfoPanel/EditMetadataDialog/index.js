import React, { Component, Fragment } from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
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
      'veritoneProgram.programLiveImage',
      ''
    ),
    programImage: get(this.props.metadata, 'veritoneProgram.programImage', ''),
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
        programLiveImage: this.state.programLiveImageFile,
        programImage: this.state.programImageFile
      }
    }
    this.props.onSave(metadataToUpdate);
  };

  hasPendingChanges = () => {
    const { filename, source } = this.state;
    return (
      filename !== get(this.props.metadata, 'veritoneFile.filename', '') ||
      source !== get(this.props.metadata, 'veritoneCustom.source', '') ||
      this.state.programImageFile ||
      this.state.programLiveImageFile
    );
  };

  handleStartPickFiles = fileType => event => {
    this.setState({
      selectingFile: true,
      selectFileType: fileType
    });
  };

  handleFilesSelected = files => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.setState((prevState, props) => {
        return {
          [prevState.selectFileType]: fileReader.result,
          [prevState.selectFileType + 'File']: files[0],
          selectingFile: false,
          selectFileType: null
        };
      });
    };

    fileReader.readAsDataURL(files[0]);
  };

  handleCloseFilePicker = () => {
    this.setState({
      selectingFile: false,
      selectFileType: null
    });
  };

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
                  onClick={this.handleStartPickFiles('programLiveImage')}
                >
                  <div className={styles.programImageLabel}>
                    Program Live Image
                  </div>
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
                <div
                  className={styles.imageSection}
                  onClick={this.handleStartPickFiles('programImage')}
                >
                  <div className={styles.programImageLabel}>Program Image</div>
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
