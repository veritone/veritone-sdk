import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/styles';
import { string, func, bool, number, node, shape, any } from 'prop-types';

import styles from './styles';

class FilePickerHeader extends Component {
  static propTypes = {
    selectedTab: string,
    onSelectTab: func,
    onClose: func,
    allowUrlUpload: bool,
    multiple: bool,
    title: string,
    fileCount: number,
    maxFiles: number,
    hideTabs: bool,
    titleIcon: node,
    message: string,
    classes: shape({ any }),
  };

  static defaultProps = {
    title: 'File Picker'
  };

  handleTabChange = (event, value) => {
    this.props.onSelectTab(value);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.filePickerHeader}>
        <span
          className={classes.filePickerTitle}
          data-veritone-element="picker-header-title"
          data-test="filePickerTitle"
        >
          {
            this.props.titleIcon && (
              <div className={classes.titleIconContainer}>
                {this.props.titleIcon}
              </div>
            )
          }
          {this.props.title}

          {this.props.multiple &&
            this.props.maxFiles && (
              <span className={classes.count}>
                {this.props.fileCount} / {this.props.maxFiles}
              </span>
            )}
        </span>
        {this.props.onClose && (
          <IconButton
            data-veritone-element="picker-header-close-btn"
            classes={{
              root: classes.filePickerCloseButton
            }}
            onClick={this.props.onClose}
          >
            <i className="icon-close-exit" />
          </IconButton>
        )}
        {
          this.props.message && (
            <div
              className={classes.filePickerMessage}
              data-veritone-element="picker-header-msg"
            >
              {this.props.message}
            </div>
          )
        }
        {
          !this.props.hideTabs && (
            <Tabs
              value={this.props.selectedTab}
              indicatorColor="primary"
              onChange={this.handleTabChange}
              className={classes.filePickerTabs}
            >
              <Tab label="Upload" value="upload" />
              {this.props.allowUrlUpload && <Tab label="By URL" value="by-url" />}
            </Tabs>
          )
        }
      </div>
    );
  }
}

export default withStyles(styles)(FilePickerHeader);
