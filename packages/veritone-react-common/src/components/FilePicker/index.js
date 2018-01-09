import React, { Component } from 'react';
import { isString, isArray } from 'lodash';
import pluralize from 'pluralize';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import mime from 'mime-types';
import Paper from 'material-ui/Paper';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import { string, arrayOf, oneOfType, number, bool, func } from 'prop-types';
import FileUploader from './FileUploader';
import FileList from './FileList';
import FilePickerHeader from './FilePickerHeader';
import FilePickerFooter from './FilePickerFooter';
import UrlUploader from './UrlUploader';
import styles from './styles.scss';

@withMuiThemeProvider
class FilePicker extends Component {
  static propTypes = {
    accept: oneOfType([arrayOf(string), string]), // extension or mimetype
    multiple: bool,
    width: number,
    height: number,
    onPickFiles: func.isRequired,
    onRequestClose: func.isRequired,
    allowUrlUpload: bool
  };

  static defaultProps = {
    height: 400,
    width: 600,
    accept: [],
    multiple: true,
    allowUrlUpload: true
  };

  state = {
    selectedTab: 'upload',
    files: [],
    errorMessage: ''
  };

  handleRemoveFile = index => {
    this.setState({
      files: [
        ...this.state.files.slice(0, index),
        ...this.state.files.slice(index + 1)
      ]
    });

    this.clearErrorMessage();
  };

  handleFilesSelected = fileOrFiles => {
    const files = isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

    if (this.props.multiple) {
      this.setState({
        files: [...this.state.files, ...files]
      });

      return this.clearErrorMessage();
    } else {
      // single mode
      this.setState({
        files: [files[0]]
      });

      if (this.state.files.length >= 1 || files.length > 1) {
        // if a file was already staged, or user tried to add more than one file
        this.setState({
          errorMessage:
            'Only a single file is supported for this input;' +
            ' the first selected file has been staged.'
        });
      } else {
        this.clearErrorMessage();
      }
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
    this.props.onPickFiles(this.state.files);

    this.setState({
      files: []
    });

    this.clearErrorMessage();
  };

  clearErrorMessage() {
    this.setState({
      errorMessage: ''
    });
  }

  render() {
    const acceptedFileTypes = (isString(this.props.accept)
      ? [this.props.accept]
      : this.props.accept
    ).map(t => mime.lookup(t) || t); // use full mimetype when possible

    return (
      <Paper
        classes={{
          root: styles.filePickerPaperOverride
        }}
        style={{
          height: this.props.height,
          width: this.props.width
        }}
      >
        <div
          className={styles.filePicker}
          style={{
            height: '100%'
          }}
        >
          <FilePickerHeader
            selectedTab={this.state.selectedTab}
            onSelectTab={this.handleTabChange}
            onClose={this.handleCloseModal}
            allowUrlUpload={this.props.allowUrlUpload}
          />

          {this.state.selectedTab === 'upload' && (
            <div className={styles.filePickerBody}>
              <DragDropContextProvider backend={HTML5Backend}>
                <FileUploader
                  onFilesSelected={this.handleFilesSelected}
                  onFilesRejected={this.handleFilesRejected}
                  acceptedFileTypes={acceptedFileTypes}
                  multiple={this.props.multiple}
                />
              </DragDropContextProvider>
              {this.state.files.length > 0 && (
                <FileList
                  files={this.state.files}
                  onRemoveFile={this.handleRemoveFile}
                />
              )}
            </div>
          )}

          {this.state.selectedTab === 'by-url' && (
            <div className={styles.filePickerBody}>
              <UrlUploader
                onUpload={this.handleFilesSelected}
                acceptedFileTypes={acceptedFileTypes}
              />
            </div>
          )}
          <div className={styles.errorMessage}>{this.state.errorMessage}</div>
          <FilePickerFooter
            onCancel={this.handleCloseModal}
            onSubmit={this.handlePickFiles}
            fileCount={this.state.files.length}
          />
        </div>
      </Paper>
    );
  }
}

export default FilePicker;
