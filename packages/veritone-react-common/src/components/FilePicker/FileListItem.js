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

    componentWillMount() {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.setState({
                file: this.props.file,
                dataUrl: fileReader.result
            });
        }
        fileReader.readAsDataURL(this.props.file);
    }

    render() {
        return (
            <div className={styles.fileListItem}>
                <img src={this.state.dataUrl} className={styles.fileListItemImage}></img>
                <div className={styles.fileListItemText}>
                    {this.props.file.name}
                    {this.props.file.size}
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