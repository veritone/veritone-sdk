import React, { Component } from 'react';
import Button from 'material-ui/Button';
import FileUpload from 'material-ui-icons/FileUpload';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

@withMuiThemeProvider
export default class FileUploader extends Component {
    render () {
        return (
            <div className={styles.fileUploader}>
                <FileUpload />
                Drag & Drop file(s) to upload or
                <input accept="jpg,jpeg,JPG,JPEG" id="file" multiple type="file" />
                <label htmlFor="file">
                    <Button raised color="primary">
                        Choose File
                    </Button>
                </label>
            </div>
        );
    }
}