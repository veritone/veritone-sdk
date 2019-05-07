import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { shape, func, number, string } from 'prop-types';

import styles from './styles.scss';

import { formatBytes } from '../../../helpers/format.js';

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

  UNSAFE_componentWillMount() {
    this.readImageFile(this.props.file);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.file !== this.props.file) {
      this.readImageFile(nextProps.file);
    }
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
