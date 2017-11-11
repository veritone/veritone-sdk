import React, { Component } from 'react';
import FileUploader from './FileUploader';
import FileList from './FileList';
import FilePickerHeader from './FilePickerHeader/FilePickerHeader';
import FilePickerFooter from './FilePickerFooter/FilePickerFooter';
import UrlUploader from './UrlUploader';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './styles.scss';
import _ from 'lodash';

import {
    shape,
    string,
    arrayOf,
    oneOfType
  } from 'prop-types';

@withMuiThemeProvider
class FilePicker extends Component {
    state = {
        selectedTab: "upload",
        selectedFiles: []
    };

    handleRemoveFile = file => {
        let array = this.state.selectedFiles;
        let fileIndex = _.findIndex(this.state.selectedFiles, {
            'name': file.name,
            'size': file.size,
            'lastModified': file.lastModified,
            'type': file.type
        });
        array.splice(fileIndex, 1);
        this.setState({selectedFiles: array});
    }

    handleFilesSelected = files => {
        this.setState({selectedFiles: files});
    }

    handleTabChange = value => {
        this.setState({selectedTab: value});
    }

    render () {
        let pickerOptions = this.props.options || {};
        return (
            <div>
                <div className={styles.filePicker}
                     style={{
                         height: pickerOptions.height || 400,
                         width: pickerOptions.width || 600
                     }}>
                    <FilePickerHeader selectedTab={this.state.selectedTab}
                                      onSelectTab={this.handleTabChange}/>
                    { 
                        this.state.selectedTab === "upload" && 
                            <div className={styles.filePickerBody}>
                                <FileUploader onFilesSelected={this.handleFilesSelected}
                                                acceptedFileTypes={pickerOptions.accept}/>
                                { 
                                    this.state.selectedFiles.length > 1  &&
                                        <FileList files={this.state.selectedFiles}
                                                  onRemoveFile={this.handleRemoveFile}/>
                                }
                            </div>
                    }
                    { 
                        this.state.selectedTab === "by-url" && 
                            <div className={styles.filePickerBody}>
                                <UrlUploader />
                            </div> 
                    }
                    <FilePickerFooter />
                </div>
                <div className={styles.overlay}></div>
            </div>
        );
    }
};

FilePicker.propTypes = {
    options: shape({
        width: string,
        height: string,
        accept: oneOfType([arrayOf(string), string])
    })
}

export default FilePicker;