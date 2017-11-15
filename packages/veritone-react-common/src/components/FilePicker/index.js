import React, { Component } from 'react';
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
import Dialog from 'material-ui/Dialog';

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
            let newFiles = this.state.files.slice();
            if (this.props.options && this.props.options.accept) {
                monitor.getItem().files.forEach((file) => {
                    // TODO: validate mime types.
                    newFiles.push(file);
                });
                this.setState({
                    files: newFiles
                });
            } else {
                this.setState({
                    files: newFiles.concat(monitor.getItem().files)
                });
            }
		}
    }

    render () {
        let pickerOptions = this.props.options || {};
        const { FILE } = NativeTypes;
        return (
            <Dialog open={this.state.isOpen}>
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
            </Dialog>
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