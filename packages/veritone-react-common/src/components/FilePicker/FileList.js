import React, { Component } from 'react';
import FileListItem from './FileListItem';
import List from 'material-ui/List';
import styles from './styles.scss';

import {
    arrayOf,
    object
  } from 'prop-types';

class FileList extends Component {
    state = {
        files: []
    }

    componentWillMount() {
        console.log(this.props.files);
        this.setState({files: this.props.files});
    }

    render() {
        const listStyle = {
            position: 'relative',
            overflowY: 'auto',
            maxHeight: this.props.height || 200,
        };
        return (
            <List style={listStyle}>
                {
                    this.state.files.map((file, index) => {
                        return <FileListItem key={index} file={file} />
                    })
                }
            </List>
        );
    }
}

FileList.propTypes = {
    files: arrayOf(object).isRequired
}

export default FileList;