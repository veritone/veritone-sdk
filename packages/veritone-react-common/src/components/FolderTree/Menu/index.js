/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { arrayOf, func, shape } from 'prop-types';
import cx from 'classnames';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import styles from './styles.scss';

export default function FolderMenu({
  folderAction,
  onMenuClick,
  folder
}) {
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
        className={cx(styles['folder-menu-button'])}
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