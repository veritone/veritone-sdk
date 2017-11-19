import React, { Component } from 'react';
import {
    arrayOf,
    object,
    func
  } from 'prop-types';
import FileListItem from './FileListItem';
import styles from './styles.scss';

class FileList extends Component {
    render() {
        const listStyle = {
            position: 'relative',
            overflowY: 'auto'
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
    files: arrayOf(object).isRequired,
    onRemoveFile: func
}

export default FileList;