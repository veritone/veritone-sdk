import React from 'react';
import { oneOf, func, bool } from 'prop-types';
import Work from '@material-ui/icons/Work';
import Add from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

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
  <Paper>
    <List component="nav" className={styles.aside}>
      {
        showFolder && (
          <ListItem
            onClick={toggleFolderView}
            className={cx(
              { [styles.selected]: currentPickerType === 'folder' },
              styles['navigation-item'])}
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
            className={cx(
              {[styles.selected]: currentPickerType === 'stream' },
              styles['navigation-item'])}
            button
          >
            <ListItemIcon className={cx(styles['icon'])}>
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
  </Paper>
);


LeftNavigationPanel.propTypes = {
  currentPickerType: oneOf(['folder', 'stream', 'upload']),
  showFolder: bool,
  showStream: bool,                // Ignore for MVP
  showUpload: bool,
  toggleFolderView: func.isRequired,
  toggleStreamView: func.isRequired,  // Ignore for MVP
  toggleUploadView: func.isRequired,
}

LeftNavigationPanel.defaultProps = {
  showFolder: true
}


export default LeftNavigationPanel;
