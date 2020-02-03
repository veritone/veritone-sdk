/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { arrayOf, func, shape } from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';

const useStyles = makeStyles(theme => ({
  ...styles
}));

export default function FolderMenu({
  folderAction,
  onMenuClick,
  folder
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = event => {
    event.stopPropagation();
    const type = event.target.getAttribute('data-type');
    setAnchorEl(null);
    onMenuClick(folder, type);
  };

  return (
    <div>
      <IconButton
        className={classes.folderMenuButton}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon style={{ fontSize: 20 }} />
      </IconButton>
      <Menu
        id="folder-tree-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {folderAction.map(item => (
          <MenuItem
            key={item.id}
            data-type={item.type}
            onClick={handleClose}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

FolderMenu.propTypes = {
  folderAction: arrayOf(Object),
  onMenuClick: func,
  folder: shape(Object)
}
