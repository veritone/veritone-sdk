import React, { Component } from 'react';
import { arrayOf, object, func, shape, any, bool } from 'prop-types';
import { withStyles } from '@material-ui/styles';
import FileListItem from './FileListItem';
import styles from './styles';

class FileList extends Component {
  render() {
    const { classes, enableResize = false, onFileResize } = this.props;
    return (
      <div className={classes.fileList}>
        {this.props.files.map((file, index) => {
          return (
            <FileListItem
              key={`${file.name}-${file.size}`}
              index={index}
              file={file}
              onRemoveFile={this.props.onRemoveFile}
              enableResize={enableResize}
              onFileResize={onFileResize}
            />
          );
        })}
      </div>
    );
  }
}

FileList.propTypes = {
  files: arrayOf(object).isRequired,
  onRemoveFile: func,
  classes: shape({ any }),
  enableResize: bool,
  onFileResize: func
};

export default withStyles(styles)(FileList);
