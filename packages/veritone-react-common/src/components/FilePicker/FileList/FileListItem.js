import React, { Component } from 'react';
import mime from 'mime-types';
import styles from './styles.scss';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import {
    object,
    func
  } from 'prop-types';

export const formatBytes = bytes => {
    if(bytes == 0) return '0 Bytes';
    var k = 1000,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

class FileListItem extends Component {
    constructor() {
        super();
        this.state = {
            dataUrl: ""
        }
    }

    handleRemoveFile() {
        this.props.onRemoveFile(this.props.index);
    }

    readImageFile(file) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.setState({
                dataUrl: fileReader.result
            });
        }
        if (/^image\//gi.test(mime.lookup(file.name))) {
            fileReader.readAsDataURL(file);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.readImageFile(nextProps.file);
    }

    componentWillMount() {
        this.readImageFile(this.props.file);
    }

    render() {
        return (
            <div className={styles.fileListItem}>
                {
                    this.state.dataUrl.length ?
                    <img src={this.state.dataUrl} 
                         className={styles.fileListItemImage}>
                    </img>:
                    <div className={styles.fileListItemFolderIcon}>
                        <i className="icon-empty-folder"></i>
                    </div>
                }
                
                <div className={styles.fileListItemText}>
                    <span className={styles.fileListItemNameText}>
                        {this.props.file.name}
                    </span>
                    <span className={styles.fileListItemFileSizeText}>
                        {formatBytes(this.props.file.size)}
                    </span>
                </div>
                <IconButton className={styles.fileListItemDeleteIcon} 
                            aria-label="Delete"
                            onClick={this.handleRemoveFile.bind(this)}>
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    }
}

FileListItem.propTypes = {
    onRemoveFile: func,
    file: object.isRequired
}

export default FileListItem;