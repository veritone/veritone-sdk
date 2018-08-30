import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import { string, func, bool } from 'prop-types';

import styles from './styles.scss';

class FilePickerHeader extends Component {
  static propTypes = {
    selectedTab: string,
    onSelectTab: func,
    onClose: func,
    allowUrlUpload: bool,
    title: string
  };

  static defaultProps = {
    title: 'File Picker'
  };

  handleTabChange = (event, value) => {
    this.props.onSelectTab(value);
  };

  render() {
    return (
      <div className={styles.filePickerHeader}>
        <span className={styles.filePickerTitle}>{this.props.title}</span>
        <IconButton
          classes={{
            root: styles.filePickerCloseButton
          }}
          onClick={this.props.onClose}
        >
          <i className="icon-close-exit" />
        </IconButton>
        <Tabs
          value={this.props.selectedTab}
          indicatorColor="primary"
          onChange={this.handleTabChange}
          className={styles.filePickerTabs}
        >
          <Tab label="Upload" value="upload" />
          {this.props.allowUrlUpload && <Tab label="By URL" value="by-url" />}
        </Tabs>
      </div>
    );
  }
}

export default FilePickerHeader;
