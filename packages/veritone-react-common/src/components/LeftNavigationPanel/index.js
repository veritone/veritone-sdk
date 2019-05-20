import React from 'react';
import { oneOf, func, bool } from 'prop-types';
import { Work, Add } from '@material-ui/icons';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';

import cx from 'classnames';
import styles from './styles.scss';

const LeftNavigationPanel = ({
  currentPickerType,
  showFolder,
  showStream,
  showUpload,
  toggleFolderView,
  toggleStreamView,
  toggleUploadView,
 }) => (
  <List component="nav" className={styles.root}>
    {
      showFolder && (
        <ListItem
          onClick={toggleFolderView}
          className={cx({ [styles.selected]: currentPickerType === 'folder' })}
          button
        >
          <ListItemIcon>
            <Work />
          </ListItemIcon>
          <ListItemText>
            My Files
          </ListItemText>
        </ListItem>
      )
    }
    {showFolder && <Divider className={styles.divider} /> }
    {
      showStream && (
        <ListItem
          onClick={toggleStreamView}
          className={cx({ [styles.selected]: currentPickerType === 'stream' })}
          button
        >
          <ListItemIcon>
            <div className='icon-streams' />
          </ListItemIcon>
          <ListItemText>
            Stream
          </ListItemText>
        </ListItem>
      )
    }
    <div className={styles.spacer} />
    {
      showUpload && (
        <ListItem
          onClick={toggleUploadView}
          className={styles['upload-button']}
          button
        >
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText>
            ADD
          </ListItemText>
        </ListItem>
      )
    }
  </List>
);


LeftNavigationPanel.propTypes = {
  currentPickerType: oneOf('folder', 'stream', 'upload'),
  showFolder: bool,
  showStream: bool,                // Ignore for MVP
  showUpload: bool,
  toggleFolderView: func.isRequired,
  toggleStreamView: func.isRequired,  // Ignore for MVP
  toggleUploadView: func.isRequired,
}


export default LeftNavigationPanel;
