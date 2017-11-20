import React, { Component } from 'react';
import mime from 'mime-types';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import {
    shape,
    func,
    number,
    string
  } from 'prop-types';
import styles from './styles.scss';

export const formatBytes = bytes => {
    if(bytes == 0) return '0 Bytes';
    let k = 1000,
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

    componentWillMount() {
        this.readImageFile(this.props.file);
    }

    componentWillReceiveProps(nextProps) {
        this.readImageFile(nextProps.file);
    }

    readImageFile = (file) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.setState({
                dataUrl: fileReader.result
            });
        }
        if (/^image\//gi.test(mime.lookup(file.name))) {
            fileReader.readAsDataURL(file);
        } else {
            this.setState({
                dataUrl: ""
            });
        }
    }

    handleRemoveFile = () => {
        this.props.onRemoveFile(this.props.index);
    }

    render() {
        return (
            <div className={styles.fileListItem}>
                {
                    this.state.dataUrl.length ?
                    <img src={this.state.dataUrl} 
                         className={styles.fileListItemImage} />:
                    <div className={styles.fileListItemFolderIcon}>
                        <i className="icon-empty-folder" />
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
                            onClick={this.handleRemoveFile}>
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    }
}

FileListItem.propTypes = {
    onRemoveFile: func,
    file: shape({
        lastModified: number,
        name: string,
        size: number,
        type: string,
        webkitRelativePath: string
    }).isRequired,
    index: number
}

export default FileListItem;