import React, { Component } from 'react';
import FileListItem from './FileListItem';
import styles from './styles.scss';

import {
    arrayOf,
    object
  } from 'prop-types';

class FileList extends Component {
    render() {
        const listStyle = {
            position: 'relative',
            overflowY: 'auto',
            maxHeight: this.props.height,
        };
        return (
            <div style={listStyle} className={styles.fileList}>
                {
                    this.props.files.map((file, index) => {
                        return <FileListItem key={index}
                                             index={index} 
                                             file={file} 
                                             onRemoveFile={this.props.onRemoveFile}/>
                    })
                }
            </div>
        );
    }
}

FileList.propTypes = {
    files: arrayOf(object).isRequired
}

export default FileList;