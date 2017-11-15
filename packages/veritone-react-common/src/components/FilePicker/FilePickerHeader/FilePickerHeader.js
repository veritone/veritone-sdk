import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './styles.scss';
import _ from 'lodash';

import {
    string,
    func
  } from 'prop-types';


@withMuiThemeProvider
class FilePickerHeader extends Component {
    handleTabChange = (event, value) => {
        this.props.onSelectTab(value);
    }

    render () {
        return (
            <div className={styles.filePickerHeader}>
                <span className={styles.filePickerTitle}>File Picker</span>
                <IconButton style={{
                        height:'28px', 
                        width: '28px',
                        position: 'absolute',
                        top: 15,
                        right: 15
                    }}
                    onClick={this.props.onCloseModal}>
                    <i className='icon-close-exit'></i>
                </IconButton>
                <Tabs value={this.props.selectedTab}
                    indicatorColor="primary"
                    onChange={this.handleTabChange} 
                    className={styles.filePickerTabs}>
                    <Tab label="Upload" value="upload"></Tab>
                    <Tab label="By URL" value="by-url"></Tab>
                </Tabs>
            </div>
        );
    }
};

FilePickerHeader.propTypes = {
    selectedTab: string,
    onSelectTab: func,
    onCloseModal: func
}

export default FilePickerHeader;