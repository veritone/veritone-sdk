import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Button from 'material-ui/Button';
import styles from './styles.scss';
import _ from 'lodash';

@withMuiThemeProvider
class FilePickerFooter extends Component {
    render () {
        return (
            <div className={styles.filePickerFooter}>
                <Button>Cancel</Button>
                <Button raised color="primary">Upload</Button>
            </div>
        );
    }
};

FilePickerFooter.propTypes = {
}

export default FilePickerFooter;