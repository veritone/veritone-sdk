import React from 'react';
import { oneOf, func, string, arrayOf } from 'prop-types';
import { CloudUploadOutlined, CardTravel } from '@material-ui/icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import cx from 'classnames';
import styles from './styles';

const useStyles = makeStyles(styles);
const LeftNavigationPanel = ({
  availablePickerTypes,
  currentPickerType,
  toggleContentView
}) => {
  const classes = useStyles();
  const navMap = {
    folder: (
      <ListItem
        /* eslint-disable react/jsx-no-bind */
        onClick={() => toggleContentView('folder')}
        className={cx(
          { [classes.selected]: currentPickerType === 'folder' },
          classes['navigationItem'])}
        button
      >
        <ListItemIcon>
          <CardTravel />
        </ListItemIcon>
        <ListItemText>
          My Files
        </ListItemText>
      </ListItem>
    ),
    stream: (
      <ListItem
        /* eslint-disable react/jsx-no-bind */
        onClick={() => toggleContentView('stream')}
        className={cx(
          { [classes.selected]: currentPickerType === 'stream' },
          classes['navigationItem'])}
        button
      >
        <ListItemIcon className={cx(classes['icon'])}>
          <div className='icon-streams' />
        </ListItemIcon>
        <ListItemText>
          Stream
        </ListItemText>
      </ListItem>
    ),
    upload: (
      <ListItem
        /* eslint-disable react/jsx-no-bind */
        onClick={() => toggleContentView('upload')}
        className={cx(
          { [classes.selected]: currentPickerType === 'upload' },
          classes['navigationItem'])}
        button
      >
        <ListItemIcon>
          <CloudUploadOutlined />
        </ListItemIcon>
        <ListItemText>
          New Upload
        </ListItemText>
      </ListItem>
    )
  }

  return (
    <Paper>
      <List component="nav" className={classes.aside}>
        {
          availablePickerTypes.map(pickerType => (
            <div key={`navigation-btn-${pickerType}`}>
              {navMap[pickerType]}
            </div>
          ))
        }
      </List>
    </Paper>
  );
};


LeftNavigationPanel.propTypes = {
  availablePickerTypes: arrayOf(string).isRequired,
  currentPickerType: oneOf(['folder', 'stream', 'upload']),
  toggleContentView: func.isRequired
}

export default LeftNavigationPanel;
