import React, { Component } from 'react';
import { isString, isArray } from 'lodash';
import HTML from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import pluralize from 'pluralize';
import mime from 'mime-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import { string, arrayOf, oneOfType, number, bool, func, shape, any } from 'prop-types';
import FileUploader from './FileUploader';
import FileList from './FileList';
import FilePickerHeader from './FilePickerHeader';
import FilePickerFooter from './FilePickerFooter';
import UrlUploader from './UrlUploader';
import FilePickerFlatHeader from './FilePickerHeader/FilePickerFlatHeader';
import ResizePanel from './ResizePanel';
import styles from './styles';

class FilePicker extends Component {
  static propTypes = {
    accept: oneOfType([arrayOf(string), string]), // extension or mimetype
    multiple: bool,
    width: number,
    height: number,
    onPickFiles: func.isRequired,
    onRequestClose: func.isRequired,
    allowUrlUpload: bool,
    maxFiles: number,
    title: string,
    tooManyFilesErrorMessage: func,
    oneFileOnlyErrorMessage: string,
    enableResize: bool,
    aspectRatio: number,
    classes: shape({ any })
  };

  static defaultProps = {
    width: 600,
    accept: [],
    multiple: false,
    allowUrlUpload: true,
    title: 'File Picker',
    tooManyFilesErrorMessage: maxFiles =>
      `You can select up to and including ${maxFiles} files. Please remove any unnecessary files.`,
    oneFileOnlyErrorMessage: `Only one file can be selected at a time`,
    enableResize: false,
    aspectRatio: 16 / 9
  };

  state = {
    selectedTab: 'upload',
    resize: {
      showing: false,
      targetFile: null
    },
    files: [],
    errorMessage: ''
  };

  handleRemoveFile = index => {
    this.setState(state => ({
      files: [...state.files.slice(0, index), ...state.files.slice(index + 1)]
    }));

    this.clearErrorMessage();
  };

  handleFilesSelected = fileOrFiles => {
    const files = isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

    if (this.props.multiple) {
      if (
        this.props.maxFiles &&
        (this.state.files.length >= this.props.maxFiles ||
          files.length > this.props.maxFiles)
      ) {
        // if a file was already staged, or user tried to add more than one file
        this.setState({
          errorMessage: this.props.tooManyFilesErrorMessage(this.props.maxFiles)
        });
      } else {
        this.clearErrorMessage();
      }

      this.setState(state => ({
        files: [...state.files, ...files]
      }));
    } else {
      // single mode
      if (this.state.files.length >= 1 || files.length > 1) {
        // if a file was already staged, or user tried to add more than one file
        this.setState({
          errorMessage: this.props.oneFileOnlyErrorMessage
        });
      } else {
        this.clearErrorMessage();
      }

      this.setState({
        files: [files[0]]
      });
    }
  };

  handleFilesRejected = num => {
    const files = pluralize('file', num);
    const were = pluralize('was', num);

    this.setState({
      // prettier-ignore
      errorMessage: `${num} ${files} ${were} rejected due to filetype restrictions.`
    });
  };

  handleTabChange = value => {
    this.setState({
      selectedTab: value
    });

    this.clearErrorMessage();
  };

  handleCloseModal = () => {
    this.props.onRequestClose();
  };

  handlePickFiles = () => {
    const files = this.state.files;

    this.clearErrorMessage();
    this.setState(
      {
        files: []
      },
      () => this.props.onPickFiles(files)
    );
  };

  onFileResize = (file) => {
    this.setState({
      resize: {
        showing: true,
        targetFile: file
      }
    })
  }

  clearErrorMessage() {
    this.setState({
      errorMessage: ''
    });
  }

  disableNextStep() {
    if (this.props.multiple && this.props.maxFiles) {
      return (
        this.state.files.length > this.props.maxFiles ||
        this.state.files.length === 0 || this.state.resize.showing
      );
    } else {
      return this.state.files.length === 0 || this.state.resize.showing;
    }
  }

  onSubmitResize = (croppedFile) => {
    this.setState(state => ({
      files: state.files.map(file => {
        if (`cropped-${file.name}` === croppedFile.name) {
          return croppedFile;
        }
        return file;
      })
    }));
    this.setState({
      resize: {
        showing: false,
        targetFile: null
      }
    })
  };

  onCancalResize = () => {
    this.setState({
      resize: {
        showing: false,
        targetFile: null
      }
    });
  };

  render() {
    const acceptedFileTypes = (isString(this.props.accept)
      ? [this.props.accept]
      : this.props.accept
    ).map(t => mime.lookup(t) || t); // use full mimetype when possible
    const { classes } = this.props;
    const { resize: {
      showing: resizeShowing,
      targetFile
    } } = this.state;

    return (
      <DndProvider backend={HTML}>
        <Paper
          classes={
            this.props.onRequestClose && {
              root: classes.filePickerPaperOverride
            }
          }
          style={{
            height: this.props.height,
            width: this.props.width
          }}
        >
          <div
            className={
              this.props.onRequestClose
                ? classes.filePicker
                : classes.filePickerNonModal
            }
            style={{
              height: '100%'
            }}
          >
            {this.props.onRequestClose ? (
              <FilePickerHeader
                selectedTab={this.state.selectedTab}
                onSelectTab={this.handleTabChange}
                onClose={this.handleCloseModal}
                allowUrlUpload={this.props.allowUrlUpload}
                title={this.props.title}
                fileCount={this.state.files.length}
                maxFiles={this.props.maxFiles}
                multiple={this.props.multiple}
              />
            ) : (
                <FilePickerFlatHeader
                  title={this.props.title}
                  fileCount={this.state.files.length}
                  maxFiles={this.props.maxFiles}
                />
              )}

            {this.state.selectedTab === 'upload' && (
              <div className={classes.filePickerBody} data-test="filePickerBody">
                {resizeShowing ?
                  <ResizePanel
                    file={targetFile}
                    aspectRatio={this.props.aspectRatio}
                    onSubmit={this.onSubmitResize}
                    onCancel={this.onCancalResize}
                  />
                  :
                  <React.Fragment>
                    <FileUploader
                      useFlatStyle={!this.props.onRequestClose}
                      onFilesSelected={this.handleFilesSelected}
                      onFilesRejected={this.handleFilesRejected}
                      acceptedFileTypes={acceptedFileTypes}
                      multiple={this.props.multiple}
                    />
                    {this.state.files.length > 0 && (
                      <FileList
                        enableResize={this.props.enableResize}
                        onFileResize={this.onFileResize}
                        files={this.state.files}
                        onRemoveFile={this.handleRemoveFile}
                      />
                    )}
                  </React.Fragment>
                }

              </div>
            )}

            {this.state.selectedTab === 'by-url' && (
              <div className={classes.filePickerBody}>
                <UrlUploader
                  onUpload={this.handleFilesSelected}
                  acceptedFileTypes={acceptedFileTypes}
                />
              </div>
            )}
            <div className={classes.errorMessage}>{this.state.errorMessage}</div>
            {this.props.onRequestClose && (
              <FilePickerFooter
                onCancel={this.handleCloseModal}
                onSubmit={this.handlePickFiles}
                disabled={this.disableNextStep()}
              />
            )}
          </div>
        </Paper>
      </DndProvider>
    );
  }
}

export default withStyles(styles)(FilePicker);
