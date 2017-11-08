import React, { Component } from 'react';
import FileUploader from './FileUploader';
import FileList from './FileList';
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
        selectedFiles: []
    };

    handleFilesSelected = files => {
        this.setState({selectedFiles: files});
    }

    handleTabChange = (event, value) => {
        this.setState({ value });
    };

    render () {
        return (
            <Paper className={styles.filePicker}>
                File Picker
                <Tabs value={this.state.value}
                      indicatorColor="primary"
                      onChange={this.handleTabChange} 
                      className={styles.filePickerTabs}>
                    <Tab label="Upload"></Tab>
                    <Tab label="By URL"></Tab>
                </Tabs>
                <div className={styles.filePickerBody}>
                    { 
                        this.state.value === 0 && 
                            <Grid container>
                                <Grid item xs={12} sm={this.state.selectedFiles.length > 1 ? 6 : 12}>
                                    <FileUploader onFilesSelected={this.handleFilesSelected}/>
                                </Grid>
                                { 
                                    this.state.selectedFiles.length > 1  &&
                                        <Grid item xs={12} sm={6}>
                                            <FileList files={this.state.selectedFiles} />
                                        </Grid>
                                }
                            </Grid>
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