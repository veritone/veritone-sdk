import React, { Component } from 'react';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Button from 'material-ui/Button';
import {
    number,
    func
  } from 'prop-types';
import styles from './styles.scss';

@withMuiThemeProvider
class FilePickerFooter extends Component {
    render () {
        return (
            <div className={styles.filePickerFooter}>
                <Button onClick={this.props.onCloseModal}>Cancel</Button>
                <Button raised
                        disabled={this.props.fileCount < 1}
                        color="primary"
                        onClick={this.props.onUploadFiles}>Upload</Button>
            </div>
        );
    }
};

FilePickerFooter.propTypes = {
    fileCount: number,
    onCloseModal: func,
    onUploadFiles: func
}

FilePickerFooter.defaultProps = {
    fileCount: 0
}

export default FilePickerFooter;