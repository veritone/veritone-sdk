import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { DropTarget } from 'react-dnd';
import { string, func, arrayOf, bool } from 'prop-types';
import mime from 'mime-types';
import { NativeTypes } from 'react-dnd-html5-backend';
const { FILE } = NativeTypes;

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

const boxTarget = {
  drop(props, monitor) {
    const droppedFiles = monitor.getItem().files;

    props.onFilesSelected(
      props.acceptedFileTypes.length
        ? // only accept dropped files of the correct type.
          droppedFiles.filter(f => props.acceptedFileTypes.includes(f.type))
        : droppedFiles
    );
  }
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
};

@withMuiThemeProvider
@DropTarget(FILE, boxTarget, collect)
class FileUploader extends Component {
  static propTypes = {
    acceptedFileTypes: arrayOf(string),
    onFilesSelected: func.isRequired,
    isOver: bool.isRequired,
    connectDropTarget: func.isRequired
  };

  static defaultProps = {
    acceptedFileTypes: []
  };

  handleFileSelection = () => {
    if (this._input.files.length > 0) {
      this.props.onFilesSelected(Array.from(this._input.files));
    }

    this._input.value = null;
  };

  setInputRef = r => (this._input = r);

  render() {
    const { acceptedFileTypes, connectDropTarget, isOver } = this.props;

    const acceptMessage = acceptedFileTypes.length
      ? `Drag & Drop <${acceptedFileTypes
          .map(mime.extension)
          .filter(Boolean)
          .join(', ')}> files to upload, or`
      : 'Drag & Drop file(s) to upload, or';

    return connectDropTarget(
      <div className={styles.fileUploader}>
        <span className={styles.fileUploadIcon}>
          <i className="icon-cloud_upload" />
        </span>
        <span className={styles.fileUploaderSubtext}>{acceptMessage}</span>
        <input
          accept={acceptedFileTypes.join(',')}
          style={{ display: 'none' }}
          id="file"
          multiple
          type="file"
          onChange={this.handleFileSelection}
          ref={this.setInputRef}
        />
        <label htmlFor="file">
          <Button raised color="primary" component="span">
            Choose File
          </Button>
        </label>
        {isOver && <div className={styles.uploaderOverlay} />}
      </div>
    );
  }
}

export default FileUploader;
