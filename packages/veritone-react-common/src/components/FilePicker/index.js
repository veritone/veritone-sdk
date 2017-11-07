import React, { Component } from 'react';
import FileUploader from './FileUploader';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

@withMuiThemeProvider
export default class FilePicker extends Component {
    state = {
        value: 0,
        uploadedFiles: []
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render () {
        return (
            <Paper className={styles.filePicker}>
                File Picker
                <Tabs value={this.state.value}
                      indicatorColor="primary"
                      onChange={this.handleChange} 
                      className={styles.filePickerTabs}>
                    <Tab label="Upload"></Tab>
                    <Tab label="By URL"></Tab>
                </Tabs>
                <div className={styles.filePickerBody}>
                    { 
                        this.state.value === 0 && 
                        <div>
                            <Grid container>
                                <Grid item xs={12} sm={this.state.uploadedFiles.length ? 6 : 12}>
                                    <FileUploader />
                                </Grid>
                                { 
                                    this.state.uploadedFiles.length > 0  &&
                                        <Grid item xs={12} sm={6}>
                                            <div> This will be my file list </div>
                                        </Grid>
                                }
                            </Grid>
                        </div> 
                    }
                    { this.state.value === 1 && <div>Url Upload</div> }
                </div>
                <div className={styles.filePickerButtons}>
                    <Button>Cancel</Button>
                    <Button raised color="primary">Upload</Button>
                </div>
            </Paper>
        );
    }
}