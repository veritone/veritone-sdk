import React, { Component } from 'react';
import { arrayOf, object, func } from 'prop-types';
import { withStyles } from 'helpers/withStyles';
import FileListItem from './FileListItem';
import styles from './styles';
const classes = withStyles(styles);

class FileList extends Component {
  render() {
    return (
      <div className={classes.fileList}>
        {this.props.files.map((file, index) => {
          return (
            <FileListItem
              key={`${file.name}-${file.size}`}
              index={index}
              file={file}
              onRemoveFile={this.props.onRemoveFile}
            />
          );
        })}
      </div>
    );
  }
}

FileList.propTypes = {
  files: arrayOf(object).isRequired,
  onRemoveFile: func
};

export default FileList;
