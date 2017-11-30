import React, { Component } from 'react';
import { isString } from 'lodash';
import pluralize from 'pluralize';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import mime from 'mime-types';
import Dialog from 'material-ui/Dialog';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import { string, arrayOf, oneOfType, number, bool, func } from 'prop-types';
import FileUploader from './FileUploader/FileUploader';
import FileList from './FileList/FileList';
import FilePickerHeader from './FilePickerHeader/FilePickerHeader';
import FilePickerFooter from './FilePickerFooter/FilePickerFooter';
import UrlUploader from './UrlUploader/UrlUploader';
import styles from './styles.scss';

@withMuiThemeProvider
class FilePicker extends Component {
  static propTypes = {
    isOpen: bool,
    width: number,
    height: number,
    accept: oneOfType([arrayOf(string), string]), // extension or mimetype
    onUploadFiles: func.isRequired,
    onRequestClose: func.isRequired
  };

  static defaultProps = {
    height: 400,
    width: 600,
    accept: []
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

  handleFilesSelected = files => {
    // fixme: merge in multiple-selection mode
    this.setState({ files: files });
    this.clearErrorMessage();
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
      selectedTab: value,
      // fixme -- do we want to lose files between modes?
      files: []
    });

    this.clearErrorMessage();
  };

  handleUrlUpload = file => {
    // fixme: handle multiple
    this.setState({ files: [file] });
    this.clearErrorMessage();
  };

  handleCloseModal = () => {
    this.props.onRequestClose();
  };

  handleUploadFiles = () => {
    this.props.onRequestClose();
    this.props.onUploadFiles(this.state.files);

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
      <Dialog
        open={this.props.isOpen}
        classes={{
          paper: styles.filePickerPaperOverride
        }}
      >
        <div
          className={styles.filePicker}
          style={{
            height: this.props.height,
            width: this.props.width,
            maxWidth: '100%'
          }}
        >
          <FilePickerHeader
            selectedTab={this.state.selectedTab}
            onSelectTab={this.handleTabChange}
            onClose={this.handleCloseModal}
          />
          {this.state.selectedTab === 'upload' && (
            <div className={styles.filePickerBody}>
              <DragDropContextProvider backend={HTML5Backend}>
                <FileUploader
                  onFilesSelected={this.handleFilesSelected}
                  onFilesRejected={this.handleFilesRejected}
                  acceptedFileTypes={acceptedFileTypes}
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
                onUrlUpload={this.handleUrlUpload}
                accept={acceptedFileTypes}
              />
            </div>
          )}
          <div>{this.state.errorMessage}</div>
          <FilePickerFooter
            onCancel={this.handleCloseModal}
            onUploadFiles={this.handleUploadFiles}
            fileCount={this.state.files.length}
          />
        </div>
      </Dialog>
    );
  }
}

export default FilePicker;
