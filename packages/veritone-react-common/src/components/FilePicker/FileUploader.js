import React, { Component } from 'react';
import Button from 'material-ui/Button';
import FileUpload from 'material-ui-icons/FileUpload';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

@withMuiThemeProvider
export default class FileUploader extends Component {
    state = {
        files: this.props.preselectedFiles
    }

    handleFileSelection = event => {
        this.setState({files: event.target.files});
    }

    render () {
        return (
            <div className={styles.fileUploader}>
                <span><FileUpload /></span>
                <span>Drag & Drop file(s) to upload or</span>
                <div>
                <input accept=".jpg,.jpeg,.JPG,.JPEG" 
                       id="file" 
                       multiple 
                       type="file"
                       onChange={this.handleFileSelection}/>
                <label htmlFor="file">
                    <Button raised color="primary" component="span">
                        {this.state.files ? 'Edit Files' : 'Choose File'}
                    </Button>
                </label>
                </div>
            </div>
        );
    }
}