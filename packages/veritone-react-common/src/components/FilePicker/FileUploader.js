import React, { Component } from 'react';
import Button from 'material-ui/Button';

import {
    string,
    func,
    arrayOf,
    oneOfType
  } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

@withMuiThemeProvider
export default class FileUploader extends Component {
    static propTypes = {
        acceptedFileTypes: oneOfType([arrayOf(string), string]),
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
            this.props.onFilesSelected(Array.from(target.files));
        }

        this.fileInput.value = null;
    }

    render () {
        let accept = typeof this.state.acceptedFileTypes === 'string' ?
            this.state.acceptedFileTypes :
            this.state.acceptedFileTypes.join(',');
        return (
            <div className={styles.fileUploader}>
                <span className={styles.fileUploadIcon}>
                    <i className="icon-cloud_upload"></i>
                </span>
                <span className={styles.fileUploaderSubtext}>
                    Drag & Drop file(s) to upload or
                </span>
                <input accept={accept} 
                       id="file" 
                       multiple 
                       type="file"
                       ref={ele => this.fileInput = ele}
                       onChange={this.handleFileSelection}/>
                <label htmlFor="file">
                    <Button raised color="primary" component="span">
                        Choose File
                    </Button>
                </label>
            </div>
        );
    }
}