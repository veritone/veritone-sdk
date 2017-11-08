import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import {
    objectOf,
    any,
    string,
    bool,
    func,
    arrayOf,
    shape,
    number
  } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

@withMuiThemeProvider
export default class FileUploader extends Component {
    static propTypes = {
        acceptedFileTypes: arrayOf(string),
        onFilesSelected: func
    }

    state = {
        files: [],
        acceptedFileTypes: this.props.acceptedFileTypes || []
    }

    handleFileSelection = event => {
        this.setState({files: event.target.files});
        let target = event.target || event.srcElement;
        if (target.files.length > 0) {
            this.props.onFilesSelected(target.files);
        }
    }

    render () {
        return (
            <div className={styles.fileUploader}>
                <span className={styles.fileUploadIcon}>
                    <i className="icon-cloud_upload"></i>
                </span>
                <span className={styles.fileUploaderSubtext}>
                    Drag & Drop file(s) to upload or
                </span>
                <input accept={this.state.acceptedFileTypes.join(',')} 
                       id="file" 
                       multiple 
                       type="file"
                       onChange={this.handleFileSelection}/>
                <label htmlFor="file">
                    <Button raised color="primary" component="span">
                        {this.state.files.length ? 'Edit Files' : 'Choose File'}
                    </Button>
                </label>
            </div>
        );
    }
}