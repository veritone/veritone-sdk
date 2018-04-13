import React, { Component } from 'react';
import { arrayOf, object, func } from 'prop-types';
import FileListItem from './FileListItem';
import styles from './styles.scss';

class FileList extends Component {
  render() {
    return (
      <div className={styles.fileList}>
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
