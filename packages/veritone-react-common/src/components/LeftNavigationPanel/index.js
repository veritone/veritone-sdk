import React from 'react';
import { oneOf, func, string, arrayOf } from 'prop-types';
import { Work, AddBox } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

import cx from 'classnames';
import styles from './styles.scss';

const LeftNavigationPanel = ({
  availablePickerTypes,
  currentPickerType,
  toggleContentView
 }) => (
  <Paper>
    <List component="nav" className={styles.aside}>
      {
        availablePickerTypes.includes('folder') && (
          <div>
            <ListItem
              /* eslint-disable react/jsx-no-bind */
              onClick={() => toggleContentView('folder')}
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
            <Divider className={styles.divider} />
          </div>
        )
      }
      {
        availablePickerTypes.includes('stream') && (
          <ListItem
            /* eslint-disable react/jsx-no-bind */
            onClick={() => toggleContentView('stream')}
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
        currentPickerType !== 'upload'
          && availablePickerTypes.includes('upload') && (
          <ListItem
            /* eslint-disable react/jsx-no-bind */
            onClick={() => toggleContentView('upload')}
            className={styles['upload-button']}
            button
          >
            <ListItemIcon>
              <AddBox />
            </ListItemIcon>
            <ListItemText>
              UPLOAD
            </ListItemText>
          </ListItem>
        )
      }
    </List>
  </Paper>
);


LeftNavigationPanel.propTypes = {
  availablePickerTypes: arrayOf(string).isRequired,
  currentPickerType: oneOf(['folder', 'stream', 'upload']),
  toggleContentView: func.isRequired
}

export default LeftNavigationPanel;
