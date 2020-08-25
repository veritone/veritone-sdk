import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CropIcon from '@material-ui/icons/Crop';
import { withStyles } from '@material-ui/styles';
import { shape, func, number, string, any, bool } from 'prop-types';

import { formatBytes } from '../../../helpers/format.js';

import styles from './styles';

class FileListItem extends Component {
  static propTypes = {
    onRemoveFile: func.isRequired,
    onFileResize: func.isRequired,
    enableResize: bool,
    file: shape({
      lastModified: number,
      name: string,
      size: number,
      type: string,
      webkitRelativePath: string
    }).isRequired,
    index: number.isRequired,
    classes: shape({ any }),
  };

  state = {
    dataUrl: ''
  };

  UNSAFE_componentWillMount() {
    this.readImageFile(this.props.file);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.file !== this.props.file) {
      this.readImageFile(nextProps.file);
    }
  }

  get isImageFile() {
    const { file } = this.props;
    const fileType = file['type'];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return validImageTypes.includes(fileType);
  }

  readImageFile = file => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.setState({
        dataUrl: fileReader.result
      });
    };

    if (/^image\//i.test(file.type)) {
      fileReader.readAsDataURL(file);
    } else {
      this.setState({
        dataUrl: ''
      });
    }
  };

  handleRemoveFile = () => {
    this.props.onRemoveFile(this.props.index);
  };

  onResizeImage = () => {
    const { file } = this.props;
    this.props.onFileResize(file);
  }

  render() {
    const { classes, enableResize } = this.props;
    return (
      <div className={classes.item}>
        <div className={classes.itemPreviewContainer}>
          {this.state.dataUrl.length ? (
            <div
              style={{ backgroundImage: `url(${this.state.dataUrl})` }}
              className={classes.itemImage}
            />
          ) : (
              <div className={classes.itemFolderIcon}>
                <i className="icon-empty-folder" />
              </div>
            )}
        </div>

        <div className={classes.itemTextContainer}>
          <span className={classes.itemNameText} data-test="itemNameText">
            {this.props.file.name}
          </span>
          <span className={classes.itemFileSizeText} data-test="itemFileSizeText">
            {formatBytes(this.props.file.size)}
          </span>
        </div>

        <div className={classes.itemActionContainer}>
          {this.isImageFile && enableResize && (
            <IconButton
              data-test="filePickerResizeBtn"
              className={classes.itemDeleteIcon}
              aria-label="Resize"
              onClick={this.onResizeImage}
            >
              <CropIcon />
            </IconButton>
          )}
          <IconButton
            data-test="filePickerDeleteBtn"
            className={classes.itemDeleteIcon}
            aria-label="Delete"
            onClick={this.handleRemoveFile}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(FileListItem);
