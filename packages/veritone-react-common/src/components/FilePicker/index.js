import React, { Component } from 'react';
import Modal from 'react-modal';
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
    oneOfType,
    number,
    bool
  } from 'prop-types';

@withMuiThemeProvider
class FilePicker extends Component {
    state = {
        isOpen: this.props.isOpen,
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

    handleUrlUpload = file => {
        this.setState({selectedFiles: [file]});
        console.log(this.state);
    }

    handleCloseModal = () => {
        this.setState({isOpen:false});
    } 

    render () {
        let pickerOptions = this.props.options || {};
        let acceptedFileTypes = typeof pickerOptions.accept === 'string' ?
            [pickerOptions.accept] :
            pickerOptions.accept;
        return (
            <Modal isOpen={this.state.isOpen}
                   className={styles.modalContainer}
                   overlayClassName={styles.overlay}>
                <div
                  className={styles.filePicker}
                  style={{
                    height: pickerOptions.height || 400,
                    width: pickerOptions.width || 600
                  }}
                >
                    <FilePickerHeader selectedTab={this.state.selectedTab}
                                      onSelectTab={this.handleTabChange}
                                      onCloseModal={this.handleCloseModal}/>
                    { 
                        this.state.selectedTab === "upload" && 
                            <div className={styles.filePickerBody}>
                                <FileUploader onFilesSelected={this.handleFilesSelected}
                                              acceptedFileTypes={acceptedFileTypes}/>
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
                                <UrlUploader onUrlUpload={this.handleUrlUpload}
                                                accept={acceptedFileTypes}/>
                            </div> 
                    }
                    <FilePickerFooter onCloseModal={this.handleCloseModal}/> 
                </div>
            </Modal>
        );
    }
};

FilePicker.propTypes = {
    isOpen: bool,
    options: shape({
        width: number,
        height: number,
        accept: oneOfType([arrayOf(string), string])
    })
}

export default FilePicker;