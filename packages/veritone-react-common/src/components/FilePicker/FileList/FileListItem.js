import React, { Component } from 'react';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/es/IconButton';
import { shape, func, number, string } from 'prop-types';

import styles from './styles.scss';

export const formatBytes = bytes => {
  if (bytes === 0) return '0 Bytes';
  let k = 1000,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

class FileListItem extends Component {
  static propTypes = {
    onRemoveFile: func.isRequired,
    file: shape({
      lastModified: number,
      name: string,
      size: number,
      type: string,
      webkitRelativePath: string
    }).isRequired,
    index: number.isRequired
  };

  state = {
    dataUrl: ''
  };

  componentWillMount() {
    this.readImageFile(this.props.file);
  }

  componentWillReceiveProps(nextProps) {
    this.readImageFile(nextProps.file);
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

  render() {
    return (
      <div className={styles.item}>
        <div className={styles.itemPreviewContainer}>
          {this.state.dataUrl.length ? (
            <div
              style={{ backgroundImage: `url(${this.state.dataUrl})` }}
              className={styles.itemImage}
            />
          ) : (
            <div className={styles.itemFolderIcon}>
              <i className="icon-empty-folder" />
            </div>
          )}
        </div>

        <div className={styles.itemTextContainer}>
          <span className={styles.itemNameText}>{this.props.file.name}</span>
          <span className={styles.itemFileSizeText}>
            {formatBytes(this.props.file.size)}
          </span>
        </div>

        <div className={styles.itemActionContainer}>
          <IconButton
            className={styles.itemDeleteIcon}
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

export default FileListItem;
