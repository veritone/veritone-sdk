import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';
import {
    string,
    func,
    arrayOf,
    oneOfType,
    bool
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
            this.props.onFilesSelected(Array.from(target.files));
        }

        event.target.value = null;
    }

    render () {
        const { isOver, connectDropTarget } = this.props;
        let accept = _.isString(this.state.acceptedFileTypes) ?
            this.state.acceptedFileTypes :
            this.state.acceptedFileTypes.join(',');
        return connectDropTarget(
            <div className={styles.fileUploader}>
                <span className={styles.fileUploadIcon}>
                    <i className="icon-cloud_upload" />
                </span>
                <span className={styles.fileUploaderSubtext}>
                    {
                        accept.length ?
                            'Drag & Drop <' + accept + '> file to upload to' :
                            'Drag & Drop file(s) to upload or'
                    }
                </span>
                <input accept={accept} 
                       style={{display:"none"}}
                       id="file" 
                       multiple 
                       type="file"
                       onChange={this.handleFileSelection}/>
                <label htmlFor="file">
                    <Button raised color="primary" component="span">
                        Choose File
                    </Button>
                </label>
                {isOver && <div className={styles.uploaderOverlay} />}
            </div>
        );
    }
}

FileUploader.propTypes = {
    acceptedFileTypes: oneOfType([arrayOf(string), string]),
    onFilesSelected: func,
    isOver: bool,
    connectDropTarget: func
}

export default DropTarget((props) => props.accept, boxTarget, collect)(FileUploader);