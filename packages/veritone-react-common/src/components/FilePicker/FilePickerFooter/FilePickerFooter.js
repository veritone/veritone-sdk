import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Button from 'material-ui/Button';
import styles from './styles.scss';
import _ from 'lodash';

import {
    number,
    func
  } from 'prop-types';

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