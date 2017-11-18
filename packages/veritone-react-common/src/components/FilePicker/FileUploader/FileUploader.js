import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { DropTarget } from 'react-dnd';

import {
    string,
    func,
    arrayOf,
    oneOfType
  } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import styles from './styles.scss';

const boxTarget = {
	drop(props, monitor) {
		if (props.onDrop) {
			props.onDrop(props, monitor)
		}
	}
}

const collect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

@withMuiThemeProvider
class FileUploader extends Component {
    state = {
        files: [],
        acceptedFileTypes: this.props.acceptedFileTypes || []
    }

    handleFileSelection = event => {
        this.setState({files: event.target.files});
        let target = event.target || event.srcElement;
        if (target.files.length > 0) {
            console.log(Array.from(target.files));
            this.props.onFilesSelected(Array.from(target.files));
        }

        this.fileInput.value = null;
    }

    render () {
        const { canDrop, isOver, connectDropTarget } = this.props;
        let accept = typeof this.state.acceptedFileTypes === 'string' ?
            this.state.acceptedFileTypes :
            this.state.acceptedFileTypes.join(',');
        return connectDropTarget(
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

FileUploader.propTypes = {
    acceptedFileTypes: oneOfType([arrayOf(string), string]),
    onFilesSelected: func
}

export default DropTarget((props) => props.accept, boxTarget, collect)(FileUploader);