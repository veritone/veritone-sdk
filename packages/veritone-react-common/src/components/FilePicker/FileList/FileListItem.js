import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from 'helpers/withStyles';
import { shape, func, number, string } from 'prop-types';

import { formatBytes } from '../../../helpers/format.js';

import styles from './styles';
const classes = withStyles(styles);

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
          <span className={classes.itemNameText} data-test="itemNameText">{this.props.file.name}</span>
          <span className={classes.itemFileSizeText} data-test="itemFileSizeText">
            {formatBytes(this.props.file.size)}
          </span>
        </div>

        <div className={classes.itemActionContainer}>
          <IconButton
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

export default FileListItem;
