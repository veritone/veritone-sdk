import React, { Component } from 'react';
import styles from './styles.scss';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import {
    object
  } from 'prop-types';

class FileListItem extends Component {
    state = {
        dataUrl: ""
    }

    // taken from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    formatBytes = (bytes) => {
        if(bytes == 0) return '0 Bytes';
        var k = 1000,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
     }

    readImageFile = file => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.setState({
                dataUrl: fileReader.result
            });
        }
        fileReader.readAsDataURL(file);
    }

    componentWillReceiveProps = nextProps => {
        this.readImageFile(nextProps.file);
    }

    componentWillMount() {
        this.readImageFile(this.props.file);
    }

    render() {
        return (
            <div className={styles.fileListItem}>
                <img src={this.state.dataUrl} className={styles.fileListItemImage}></img>
                <div className={styles.fileListItemText}>
                    <span className={styles.fileListItemNameText}>
                        {this.props.file.name}
                    </span>
                    <span className={styles.fileListItemFileSizeText}>
                        {this.formatBytes(this.props.file.size)}
                    </span>
                </div>
                <IconButton className={styles.fileListItemDeleteIcon} 
                            aria-label="Delete">
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    }
}

FileListItem.propTypes = {
    file: object.isRequired
}

export default FileListItem;