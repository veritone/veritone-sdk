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
import { DragDropContext, DragDropContextProvider } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';

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
        files: []
    };

    componentWillReceiveProps = (nextProps) => {
        if (this.state.isOpen !== nextProps.isOpen) {
            this.setState({isOpen: nextProps.isOpen});
        }
    }

    handleRemoveFile = index => {
        let array = this.state.files.slice();
        array.splice(index, 1);
        this.setState({files: array});
    }

    handleFilesSelected = files => {
        this.setState({files: files});
    }

    handleTabChange = value => {
        this.setState({selectedTab: value});
    }

    handleUrlUpload = file => {
        this.setState({files: [file]});
    }

    handleCloseModal = () => {
        this.setState({isOpen:false});
    } 

    handleFileDrop = (item, monitor) => {
        if (monitor) {
			const droppedFiles = [];
            monitor.getItem().files.forEach((file) => {
                let extension = file.name.replace(/.*\./, '');
            })
		}
    }

    render () {
        let pickerOptions = this.props.options || {};
        const { FILE } = NativeTypes;
        return (
            <Modal isOpen={this.state.isOpen}
                   className={styles.modalContainer}>
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
                                <DragDropContextProvider backend={HTML5Backend}>
                                    <FileUploader onFilesSelected={this.handleFilesSelected}
                                                  acceptedFileTypes={pickerOptions.accept}
                                                  onDrop={this.handleFileDrop}
                                                  accept={[FILE]}/>
                                </DragDropContextProvider>
                                { 
                                    this.state.files.length > 0  &&
                                        <FileList files={this.state.files}
                                                onRemoveFile={this.handleRemoveFile}/>
                                }
                            </div>
                    }
                    { 
                        this.state.selectedTab === "by-url" && 
                            <div className={styles.filePickerBody}>
                                <UrlUploader onUrlUpload={this.handleUrlUpload}
                                             accept={pickerOptions.accept}/>
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

export default DragDropContext(HTML5Backend)(FilePicker);