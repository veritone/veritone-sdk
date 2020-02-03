import React, { Component } from 'react';
import { noop, startsWith, endsWith } from 'lodash';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import { DropTarget } from 'react-dnd';
import { string, func, arrayOf, bool, shape, any } from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { NativeTypes } from 'react-dnd-html5-backend';
const { FILE } = NativeTypes;

import ExtensionPanel from './ExtensionPanel';

import styles from './styles';

const boxTarget = {
  drop(props, monitor) {
    const droppedFiles = monitor.getItem().files;
    const allowableDroppedFiles = droppedFiles.filter(({ type }) => {
      // only accept dropped files of the correct type. This tries to duplicate
      // the functionality of the html5 file input.

      return (
        props.acceptedFileTypes.includes(type) ||
        props.acceptedFileTypes.some(acceptedType => {
          // deal with video/*, audio/* etc
          if (endsWith(acceptedType, '/*')) {
            const typePrefix = acceptedType.match(/(.*)\/\*/)[1];
            return startsWith(type, typePrefix);
          }

          return false;
        })
      );
    });

    if (props.acceptedFileTypes.length) {
      if (allowableDroppedFiles.length) {
        props.onFilesSelected(allowableDroppedFiles);
      }

      const numRejectedFiles =
        droppedFiles.length - allowableDroppedFiles.length;
      if (numRejectedFiles > 0) {
        props.onFilesRejected(numRejectedFiles);
      }
    } else {
      props.onFilesSelected(droppedFiles);
    }
  }
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
};

@DropTarget(FILE, boxTarget, collect)
@withStyles(styles)
class FileUploader extends Component {
  static propTypes = {
    acceptedFileTypes: arrayOf(string),
    onFilesSelected: func.isRequired,
    useFlatStyle: bool,
    // eslint-disable-next-line react/no-unused-prop-types
    onFilesRejected: func,
    isOver: bool.isRequired,
    connectDropTarget: func.isRequired,
    multiple: bool,
    classes: shape({ any }),
  };

  static defaultProps = {
    acceptedFileTypes: [],
    onFilesRejected: noop
  };

  state = {
    showExtensionList: false
  };

  handleFileSelection = () => {
    if (this._input.files.length > 0) {
      this.props.onFilesSelected(Array.from(this._input.files));
    }

    this._input.value = null;
  };

  openExtensionList = () => {
    this.setState({ showExtensionList: true });
  };

  closeExtensionList = () => {
    this.setState({ showExtensionList: false });
  };

  setInputRef = r => (this._input = r);

  render() {
    const { acceptedFileTypes, connectDropTarget, isOver, classes } = this.props;
    const { showExtensionList } = this.state;

    const acceptMessage = 'Drag & Drop';
    const subMessage = 'your file(s) here, or ';

    return connectDropTarget(
      <div className={cx([
        classes.fileUploader,
        { [classes.flat]: this.props.useFlatStyle }
      ])}>
        {showExtensionList ? (
          <ExtensionPanel
            acceptedFileTypes={acceptedFileTypes}
            closeExtensionList={this.closeExtensionList} />
        ) : (
            <div className={classes.uploaderContainer}>
              {!!acceptedFileTypes.length && (
                <span
                  className={classes.extensionListOpenButton}
                  data-veritone-element="uploader-extension-open-btn"
                  onClick={this.openExtensionList}>
                  Extension Types
                </span>
              )}
              <span>
                <i className={cx(classes.fileUploadIcon, 'icon-ingest')} />
              </span>
              <span className={classes.fileUploaderAcceptText}>{acceptMessage}</span>

              <label htmlFor="file">
                <Button
                  component="span"
                  disableFocusRipple
                  disableRipple>
                  <span className={classes.fileUploaderSubtext}>{subMessage}</span>
                  <span className={cx(classes.fileUploaderSubtext, classes.subtextBlue)}>browse</span>
                </Button>
              </label>
              <input
                accept={acceptedFileTypes.join(',')}
                style={{ display: 'none' }}
                id="file"
                multiple={this.props.multiple}
                type="file"
                onChange={this.handleFileSelection}
                ref={this.setInputRef}
              />
            </div>
          )}
        {isOver && <div className={classes.uploaderOverlay} />}
      </div>
    );
  }
}

export default FileUploader;
